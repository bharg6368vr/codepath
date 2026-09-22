"""
Local, file-based vector index (no vector DB server required).

Each language gets its own TF-IDF index built from its curriculum chunks.
TF-IDF is used instead of a heavyweight neural embedding model (e.g.
sentence-transformers) to keep setup fast and fully offline, while still
giving genuine semantic-ish retrieval over the curriculum text. Swap
`embed_texts` for a real embedding model later without touching callers.
"""
import json
import os
import pickle

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

INDEX_DIR = os.path.join(os.path.dirname(__file__), "index")
CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "server", "src", "seed", "content")

os.makedirs(INDEX_DIR, exist_ok=True)


def _index_path(language_id):
    return os.path.join(INDEX_DIR, f"{language_id}.pkl")


def chunk_language_content(language_id):
    """Chunk a language's curriculum by module/subtopic."""
    path = os.path.join(CONTENT_DIR, f"{language_id}.json")
    with open(path, "r") as f:
        data = json.load(f)

    chunks = []
    for module in data["modules"]:
        pages = module.get("pages") or [{"title": module["title"], "markdown": module.get("explanationMarkdown", "")}]
        for i, page in enumerate(pages):
            chunks.append({
                "id": f"{language_id}-{module['order']}-page-{i}",
                "languageId": language_id,
                "moduleTitle": module["title"],
                "moduleOrder": module["order"],
                "text": f"# {module['title']} — {page['title']}\n\n{page['markdown']}",
            })
        takeaways = "\n".join(f"- {k}" for k in module.get("keyTakeaways", []))
        if takeaways:
            chunks.append({
                "id": f"{language_id}-{module['order']}-takeaways",
                "languageId": language_id,
                "moduleTitle": module["title"],
                "moduleOrder": module["order"],
                "text": f"Key takeaways for {module['title']}:\n{takeaways}",
            })
        for i, ex in enumerate(module.get("codeExamples", [])):
            chunks.append({
                "id": f"{language_id}-{module['order']}-example-{i}",
                "languageId": language_id,
                "moduleTitle": module["title"],
                "moduleOrder": module["order"],
                "text": f"Code example for {module['title']} ({ex.get('title', '')}):\n{ex['code']}\n{ex.get('explanation', '')}",
            })
    return chunks


def build_index(language_id):
    chunks = chunk_language_content(language_id)
    texts = [c["text"] for c in chunks]
    vectorizer = TfidfVectorizer(stop_words="english", max_features=4096)
    matrix = vectorizer.fit_transform(texts)

    with open(_index_path(language_id), "wb") as f:
        pickle.dump({"chunks": chunks, "vectorizer": vectorizer, "matrix": matrix}, f)

    return len(chunks)


def load_index(language_id):
    path = _index_path(language_id)
    if not os.path.exists(path):
        build_index(language_id)
    with open(path, "rb") as f:
        return pickle.load(f)


def retrieve_diverse(language_id, query, top_k_per_module=1):
    """
    Retrieve chunks with coverage across modules, not just top-k globally,
    so generated quizzes span the whole curriculum rather than clustering
    around whichever module is most similar to the query.
    """
    index = load_index(language_id)
    chunks = index["chunks"]
    vectorizer = index["vectorizer"]
    matrix = index["matrix"]

    query_vec = vectorizer.transform([query])
    scores = cosine_similarity(query_vec, matrix)[0]

    by_module = {}
    for chunk, score in zip(chunks, scores):
        order = chunk["moduleOrder"]
        by_module.setdefault(order, []).append((score, chunk))

    selected = []
    for order in sorted(by_module.keys()):
        ranked = sorted(by_module[order], key=lambda x: -x[0])
        for score, chunk in ranked[:top_k_per_module]:
            selected.append(chunk)

    return selected


def get_all_takeaways_chunks(language_id):
    """
    Every module has exactly one 'key takeaways' chunk (see
    chunk_language_content). Similarity-based retrieval doesn't guarantee
    it's picked for every module — a module's page/example chunks can
    outscore its own takeaways chunk for a generic query, silently starving
    that module of quiz material. This bypasses ranking entirely so quiz
    generation always has a fact to draw from for every module.
    """
    index = load_index(language_id)
    return [c for c in index["chunks"] if c["id"].endswith("-takeaways")]
