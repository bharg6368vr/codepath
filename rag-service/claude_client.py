"""
Wraps calls to the Claude API for quiz generation and answer evaluation.

Every quiz has a fixed composition: 8 multiple-choice questions, 1
fill-in-the-blank, and 1 true/false question (10 total). Uses
output_config.format (JSON schema) for guaranteed-valid structured output
instead of trusting the model to format JSON correctly on its own. If
ANTHROPIC_API_KEY is not set, falls back to a deterministic rule-based
generator/evaluator so the app still works end-to-end without a key.
"""
import json
import os
import random
import re

ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-opus-5")

QUIZ_COMPOSITION = {"mcq": 8, "fill_blank": 1, "true_false": 1}
TOTAL_QUESTIONS = sum(QUIZ_COMPOSITION.values())

QUIZ_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "type": {"type": "string", "enum": ["mcq", "fill_blank", "true_false"]},
                    "options": {"type": "array", "items": {"type": "string"}},
                    "correctAnswer": {"type": "string"},
                    "explanation": {"type": "string"},
                    "sourceModule": {"type": "string"},
                },
                "required": ["question", "type", "options", "correctAnswer", "explanation", "sourceModule"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["questions"],
    "additionalProperties": False,
}

EVAL_SCHEMA = {
    "type": "object",
    "properties": {
        "verdict": {"type": "string", "enum": ["correct", "partial", "incorrect"]},
        "feedback": {"type": "string"},
    },
    "required": ["verdict", "feedback"],
    "additionalProperties": False,
}


def _client():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return None
    import anthropic
    return anthropic.Anthropic()


def generate_quiz(language_id, chunks):
    client = _client()
    if client is None:
        return _mock_generate_quiz(language_id, chunks)

    context = "\n\n---\n\n".join(
        f"[Module: {c['moduleTitle']}]\n{c['text']}" for c in chunks
    )
    prompt = (
        f"You are generating a quiz for a course module on {language_id}. "
        f"Using ONLY the reference material below, write exactly {TOTAL_QUESTIONS} quiz questions "
        f"with this exact composition: {QUIZ_COMPOSITION['mcq']} questions of type 'mcq' (4 options each), "
        f"{QUIZ_COMPOSITION['fill_blank']} question of type 'fill_blank' (short exact-text answer), "
        f"and {QUIZ_COMPOSITION['true_false']} question of type 'true_false'. "
        "Every question must be strictly grounded in the reference material — do not invent facts not present below. "
        "Spread questions across different modules rather than clustering on one topic. "
        "For 'mcq' questions, options must contain exactly 4 entries with exactly one correct answer matching correctAnswer verbatim. "
        "For 'fill_blank' questions, options must be an empty array. "
        "For 'true_false' questions, options must be exactly [\"True\", \"False\"] and correctAnswer must be exactly \"True\" or \"False\". "
        "sourceModule must name the module the question was drawn from.\n\n"
        f"Reference material:\n{context}"
    )

    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=4096,
        output_config={"format": {"type": "json_schema", "schema": QUIZ_SCHEMA}},
        messages=[{"role": "user", "content": prompt}],
    )
    text = next(b.text for b in response.content if b.type == "text")
    data = json.loads(text)
    questions = _validate_quiz(data.get("questions", []))

    # If the model didn't hit the exact composition, top up any short
    # category from the mock generator (grounded in the same chunks) rather
    # than serving the student a lopsided or short quiz.
    by_type = {"mcq": [], "fill_blank": [], "true_false": []}
    for q in questions:
        by_type[q["type"]].append(q)

    missing = {t: max(0, n - len(by_type[t])) for t, n in QUIZ_COMPOSITION.items()}
    if any(missing.values()):
        fallback = _mock_generate_quiz(language_id, chunks)
        fallback_by_type = {"mcq": [], "fill_blank": [], "true_false": []}
        for q in fallback:
            fallback_by_type[q["type"]].append(q)
        for t, needed in missing.items():
            by_type[t].extend(fallback_by_type[t][:needed])

    final = by_type["mcq"][:8] + by_type["fill_blank"][:1] + by_type["true_false"][:1]
    return final


def _validate_quiz(questions):
    valid = []
    for q in questions:
        if not all(k in q for k in ("question", "type", "correctAnswer", "explanation")):
            continue
        if q["type"] not in QUIZ_COMPOSITION:
            continue
        if q["type"] == "mcq" and (len(q.get("options") or []) < 2 or q["correctAnswer"] not in q["options"]):
            continue
        if q["type"] == "true_false":
            opts = q.get("options") or []
            if set(opts) != {"True", "False"} or q["correctAnswer"] not in ("True", "False"):
                continue
            q["options"] = ["True", "False"]
        valid.append(q)
    return valid


def evaluate_answer(question, user_answer, correct_answer, question_type):
    client = _client()
    if client is None:
        return _mock_evaluate(user_answer, correct_answer)

    prompt = (
        f"Question ({question_type}): {question}\n"
        f"Expected answer: {correct_answer}\n"
        f"Student's answer: {user_answer}\n\n"
        "Judge whether the student's answer is correct, partially correct, or incorrect. "
        "Give brief (1-2 sentence) feedback explaining why."
    )
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=512,
        output_config={"format": {"type": "json_schema", "schema": EVAL_SCHEMA}},
        messages=[{"role": "user", "content": prompt}],
    )
    text = next(b.text for b in response.content if b.type == "text")
    return json.loads(text)


# ---- Mock fallback (no ANTHROPIC_API_KEY configured) ----

def _fact_pool(chunks):
    """(moduleTitle, fact) pairs pulled from each module's keyTakeaways chunk."""
    by_module = {}
    for c in chunks:
        by_module.setdefault(c["moduleTitle"], []).append(c)

    pool = []
    for module_title, module_chunks in by_module.items():
        takeaway_chunk = next((c for c in module_chunks if "Key takeaways" in c["text"]), None)
        if not takeaway_chunk:
            continue
        for line in takeaway_chunk["text"].splitlines():
            line = line.strip()
            if line.startswith("-"):
                fact = line.lstrip("- ").strip()
                if fact:
                    pool.append((module_title, fact))
    return pool


def _mock_mcq_questions(language_id, pool, count):
    questions = []
    candidates = pool.copy()
    random.shuffle(candidates)
    all_facts = [f for _, f in pool]

    for module_title, fact in candidates:
        if len(questions) >= count:
            break
        distractor_pool = [f for f in all_facts if f != fact]
        if len(distractor_pool) < 3:
            continue
        distractors = random.sample(distractor_pool, k=3)
        options = distractors + [fact]
        random.shuffle(options)
        questions.append({
            "question": f"Which of the following is a correct fact about {module_title} in {language_id}?",
            "type": "mcq",
            "options": options,
            "correctAnswer": fact,
            "explanation": fact,
            "sourceModule": module_title,
        })

    # Pad with repeats (shuffled options) if the fact pool was smaller than needed.
    i = 0
    while len(questions) < count and pool:
        module_title, fact = pool[i % len(pool)]
        distractor_pool = [f for f in all_facts if f != fact]
        if len(distractor_pool) >= 3:
            distractors = random.sample(distractor_pool, k=3)
            options = distractors + [fact]
            random.shuffle(options)
            questions.append({
                "question": f"Which of the following is a correct fact about {module_title} in {language_id}?",
                "type": "mcq",
                "options": options,
                "correctAnswer": fact,
                "explanation": fact,
                "sourceModule": module_title,
            })
        i += 1
        if i > len(pool) * 2:
            break
    return questions[:count]


def _mock_fill_blank_question(language_id, pool):
    candidates = pool.copy()
    random.shuffle(candidates)
    for module_title, fact in candidates:
        words = re.findall(r"[A-Za-z][A-Za-z0-9_]{3,}", fact)
        if not words:
            continue
        blank_word = random.choice(words)
        blanked = re.sub(rf"\b{re.escape(blank_word)}\b", "____", fact, count=1)
        return {
            "question": f"Fill in the blank: {blanked}",
            "type": "fill_blank",
            "options": [],
            "correctAnswer": blank_word,
            "explanation": fact,
            "sourceModule": module_title,
        }
    return {
        "question": f"Fill in the blank: {language_id} programs are organized into ____.",
        "type": "fill_blank",
        "options": [],
        "correctAnswer": "modules",
        "explanation": "This course is organized into modules covering progressively deeper topics.",
        "sourceModule": "General",
    }


def _mock_true_false_question(language_id, pool):
    if not pool:
        return {
            "question": f"True or False: {language_id} is one of the languages taught on CodePath.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": f"{language_id} is one of CodePath's four language tracks.",
            "sourceModule": "General",
        }

    true_module, fact = random.choice(pool)
    other_modules = sorted({m for m, _ in pool if m != true_module})

    if other_modules and random.choice([True, False]):
        wrong_module = random.choice(other_modules)
        return {
            "question": f"True or False: In {language_id}, the \"{wrong_module}\" module teaches that {fact.rstrip('.')}.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": f"This is actually a key takeaway from \"{true_module}\", not \"{wrong_module}\".",
            "sourceModule": wrong_module,
        }

    return {
        "question": f"True or False: In {language_id}, the \"{true_module}\" module teaches that {fact.rstrip('.')}.",
        "type": "true_false",
        "options": ["True", "False"],
        "correctAnswer": "True",
        "explanation": fact,
        "sourceModule": true_module,
    }


def _mock_generate_quiz(language_id, chunks):
    pool = _fact_pool(chunks)
    questions = _mock_mcq_questions(language_id, pool, QUIZ_COMPOSITION["mcq"])
    questions.append(_mock_fill_blank_question(language_id, pool))
    questions.append(_mock_true_false_question(language_id, pool))
    return questions


def _mock_evaluate(user_answer, correct_answer):
    ua = (user_answer or "").strip().lower()
    ca = (correct_answer or "").strip().lower()
    if ua == ca:
        return {"verdict": "correct", "feedback": "Matches the expected answer."}
    if ua and (ua in ca or ca in ua):
        return {"verdict": "partial", "feedback": "Close, but not an exact match to the expected answer."}
    return {"verdict": "incorrect", "feedback": f"Expected: {correct_answer}"}
