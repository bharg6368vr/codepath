"""Standalone ingestion script: chunk + embed + index all languages' curriculum content.

Run with: python ingest.py
"""
import vector_store

LANGUAGES = ["python", "java", "cpp", "c"]

if __name__ == "__main__":
    for lang in LANGUAGES:
        count = vector_store.build_index(lang)
        print(f"Indexed {lang}: {count} chunks")
