import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'), override=True)

import claude_client
import gemini_client
import vector_store

# Import new AI feature blueprints
from welcome_bot import welcome_bp
from code_review import code_review_bp

app = Flask(__name__)
CORS(app)

# Register new AI feature blueprints
app.register_blueprint(welcome_bp, url_prefix='/api/welcome')
app.register_blueprint(code_review_bp, url_prefix='/api/code-review')

LANGUAGES = ["python", "java", "cpp", "c"]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "llm_configured": bool(os.environ.get("ANTHROPIC_API_KEY")),
        "chatbot_configured": bool(os.environ.get("GEMINI_API_KEY")),
    })


@app.route("/ingest/<language_id>", methods=["POST"])
def ingest(language_id):
    if language_id not in LANGUAGES:
        return jsonify({"error": "Unknown language"}), 404
    count = vector_store.build_index(language_id)
    return jsonify({"language": language_id, "chunksIndexed": count})


@app.route("/ingest/all", methods=["POST"])
def ingest_all():
    results = {lang: vector_store.build_index(lang) for lang in LANGUAGES}
    return jsonify(results)


@app.route("/quiz/generate", methods=["POST"])
def quiz_generate():
    body = request.get_json(force=True) or {}
    language_id = body.get("languageId")
    if language_id not in LANGUAGES:
        return jsonify({"error": "Unknown language"}), 404

    # Every quiz is a fixed 8 mcq + 1 fill_blank + 1 true_false (see
    # claude_client.QUIZ_COMPOSITION). Diverse retrieval gives broad page/example
    # context, but similarity ranking alone doesn't guarantee every module's
    # takeaways chunk survives — so those are always included on top, ensuring
    # every module has quiz material to draw from regardless of ranking.
    query = f"{language_id} programming fundamentals quiz covering syntax, control flow, functions, data structures, error handling"
    diverse_chunks = vector_store.retrieve_diverse(language_id, query, top_k_per_module=3)
    takeaway_chunks = vector_store.get_all_takeaways_chunks(language_id)
    seen_ids = {c["id"] for c in diverse_chunks}
    chunks = diverse_chunks + [c for c in takeaway_chunks if c["id"] not in seen_ids]

    try:
        questions = claude_client.generate_quiz(language_id, chunks)
    except Exception as e:
        return jsonify({"error": f"Quiz generation failed: {e}"}), 502

    return jsonify({"questions": questions})


@app.route("/quiz/evaluate", methods=["POST"])
def quiz_evaluate():
    body = request.get_json(force=True) or {}
    required = ("question", "userAnswer", "correctAnswer", "questionType")
    if not all(k in body for k in required):
        return jsonify({"error": f"Missing fields, need: {required}"}), 400

    result = claude_client.evaluate_answer(
        body["question"], body["userAnswer"], body["correctAnswer"], body["questionType"]
    )
    return jsonify(result)


@app.route("/chat/ask", methods=["POST"])
def chat_ask():
    body = request.get_json(force=True) or {}
    messages = body.get("messages")
    language_id = body.get("languageId")

    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "messages must be a non-empty array"}), 400
    if not all(isinstance(m, dict) and m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str) for m in messages):
        return jsonify({"error": "each message needs a role ('user'|'assistant') and string content"}), 400

    try:
        reply = gemini_client.ask(messages, language_id=language_id)
    except gemini_client.ChatbotError as e:
        return jsonify({"error": str(e)}), 502

    return jsonify({"reply": reply})


if __name__ == "__main__":
    port = int(os.environ.get("RAG_SERVICE_PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)