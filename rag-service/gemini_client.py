import os
import httpx
from dotenv import load_dotenv

# Load env variables automatically
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'), override=True)

DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")
FALLBACK_MODELS = [DEFAULT_MODEL, "gemini-3.5-flash-lite", "gemini-flash-lite-latest"]

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
_transport = httpx.HTTPTransport(local_address="0.0.0.0")

MAX_HISTORY_MESSAGES = 20

SYSTEM_INSTRUCTION_TEMPLATE = (
    "You are the CodePath Study Buddy, a patient, encouraging, and expert coding tutor embedded in a "
    "learning platform for {language_label}. Students ask you about theory, syntax, debugging "
    "their own code, and general programming concepts. "
    "Answer clearly and concisely. Use markdown: fenced code blocks with the correct language tag "
    "for any code, short paragraphs, and bullet lists for steps. When a student pastes an error "
    "message, explain what causes it and how to fix it rather than just restating it. "
    "When relevant, tie answers back to {language_label} specifically, but you may also answer "
    "general programming/CS questions if asked. If a question is completely unrelated to "
    "programming or learning, gently redirect the student back to their studies."
)

GENERAL_SYSTEM_INSTRUCTION = (
    "You are the CodePath Study Buddy, a patient, encouraging, and expert coding tutor embedded in a learning "
    "platform that teaches Python, Java, C++, and C. Students ask you about theory, syntax, "
    "debugging their own code, and general programming concepts. "
    "Answer clearly and concisely. Use markdown: fenced code blocks with the correct language tag "
    "for any code, short paragraphs, and bullet lists for steps. When a student pastes an error "
    "message, explain what causes it and how to fix it rather than just restating it. "
    "If a question is completely unrelated to programming or learning, gently redirect the "
    "student back to their studies."
)

LANGUAGE_LABELS = {"python": "Python", "java": "Java", "cpp": "C++", "c": "C"}


class ChatbotError(Exception):
    pass


def ask(messages, language_id=None):
    """
    messages: list of {"role": "user"|"assistant", "content": str}, most recent last.
    language_id: optional language context (python/java/cpp/c) to tailor the system prompt.
    Returns the assistant's reply text.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ChatbotError(
            "The AI study buddy isn't configured yet — set GEMINI_API_KEY in rag-service/.env."
        )

    if language_id and language_id in LANGUAGE_LABELS:
        system_instruction = SYSTEM_INSTRUCTION_TEMPLATE.format(language_label=LANGUAGE_LABELS[language_id])
    else:
        system_instruction = GENERAL_SYSTEM_INSTRUCTION

    trimmed = messages[-MAX_HISTORY_MESSAGES:]
    contents = [
        {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
        for m in trimmed
    ]

    body = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 1024},
    }

    last_error = None
    with httpx.Client(transport=_transport, timeout=30) as client:
        for model in FALLBACK_MODELS:
            url = GEMINI_API_URL.format(model=model)
            try:
                response = client.post(url, params={"key": api_key}, json=body)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates") or []
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        text = "".join(p.get("text", "") for p in parts).strip()
                        if text:
                            return text
                else:
                    detail = response.json().get("error", {}).get("message", response.text) if response.content else response.text
                    last_error = f"Gemini error ({response.status_code}): {detail}"
            except Exception as e:
                last_error = str(e)

    raise ChatbotError(f"Could not reach Gemini service: {last_error}")


def generate_text(prompt, system_prompt="You are an expert AI code reviewer and tutor."):
    """Generate free-form text using Gemini with automatic fallbacks."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None

    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 1500},
    }

    with httpx.Client(transport=_transport, timeout=30) as client:
        for model in FALLBACK_MODELS:
            url = GEMINI_API_URL.format(model=model)
            try:
                response = client.post(url, params={"key": api_key}, json=body)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates") or []
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        text = "".join(p.get("text", "") for p in parts).strip()
                        if text:
                            return text
            except Exception:
                continue
    return None

