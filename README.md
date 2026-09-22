# CodePath

A self-paced coding education platform for **Python, Java, C++, and C**. Learners read structured course modules, practice in an embedded code editor, take a quiz generated on the fly by an LLM grounded in the course content (RAG), and earn a downloadable, publicly verifiable certificate on passing.

Built to run with **zero external infrastructure**: no database server, no required paid API keys. Every piece has a local fallback — see [How each part degrades gracefully](#how-each-part-degrades-gracefully) below.

## Features

- **Auth** — email/password signup and login, JWT-based sessions.
- **Four language tracks** — Python, Java, C++, C, each with 10 modules covering syntax through OOP/structs, error handling, memory management, file I/O, and standard-library highlights.
- **Interactive modules** — markdown explanations, worked code examples, and "try it yourself" snippets in a live Monaco editor (the same editor engine as VS Code) embedded inline.
- **Standalone Coding Workspace** — a language-agnostic online compiler: pick a language, write code, supply stdin, run it, see stdout/stderr and execution time. Seeded with a small practice-problem bank (FizzBuzz, reverse a string, factorial, palindrome check, etc.) per language.
- **RAG-generated quizzes** — no hardcoded question bank. Course content is chunked per module, indexed with TF-IDF, retrieved with per-module coverage (not just global top-k, so quizzes span the whole curriculum), and handed to Claude to generate a mix of MCQ / fill-in-the-blank / predict-the-output questions strictly grounded in that content.
- **Mixed-mode grading** — MCQ/fill-in-the-blank graded by exact match server-side; open-ended "predict the output" answers graded by Claude, which returns a structured correct/partial/incorrect verdict with feedback.
- **Certificates** — passing a quiz (default threshold: 70%) issues a PDF certificate (name, language, score, date, unique ID) generated server-side with `pdfkit`, plus a public `/verify/:certificateId` page anyone can use to confirm authenticity without logging in.

## How each part degrades gracefully

| Capability | With config | Without config |
|---|---|---|
| Quiz generation & grading | Real Claude calls via `ANTHROPIC_API_KEY` | Deterministic mock generator/grader — same code paths, same UI, no LLM |
| Code execution | Judge0 (self-hosted or RapidAPI) via `JUDGE0_API_URL` | Runs locally using the machine's installed `python3`/`gcc`/`g++`/`javac`+`java` |
| Persistent storage | — (never a real database) | A single JSON file, `server/src/data/db.json` |
| Vector search | — (never a hosted vector DB) | A local TF-IDF index pickled to `rag-service/index/*.pkl` |

This means you can clone the repo and have the entire product — course content, live code execution, quiz generation, grading, certificates — working end to end with `npm install` and no signup to any third-party service. Add `ANTHROPIC_API_KEY` later to upgrade quiz quality without changing any code.

## Where your data lives

There is no database server. All state is a plain JSON file at `server/src/data/db.json`, with one array per collection (`users`, `languages`, `modules`, `progress`, `quizAttempts`, `certificates`).

- **Login credentials**: on signup, the password is hashed with `bcrypt` (never stored in plain text) and saved in the `users` array in `db.json`. Login checks the hash and, on success, issues a JWT.
- **Sessions**: the JWT is stored in the browser's `localStorage` (`codepath_token`, `codepath_user`) and sent as a `Bearer` token on every API request. There's no server-side session store — anyone holding a valid, unexpired JWT is treated as authenticated.
- **Course content, progress, quiz attempts, certificates**: all live in the same file, keyed by user/language IDs.

This file is gitignored (`server/.gitignore`) since it can contain real user data once you start using the app.

## Architecture

```
client/        React (Vite) + Tailwind — the UI
server/        Node/Express API — auth, course content, progress, quiz
                orchestration, certificates, code execution
rag-service/   Flask microservice — chunks curriculum content, builds a
                per-language TF-IDF index, retrieves diverse context, and
                calls Claude to generate/evaluate quizzes
```

The Express server never talks to Claude directly — it proxies quiz generation/evaluation requests to `rag-service`, which owns the retrieval + LLM logic.

## Running it

Each service runs independently; start all three for the full app.

### 1. rag-service (Flask)

```bash
cd rag-service
python3 -m venv venv        # already set up if venv/ exists
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # optional: add ANTHROPIC_API_KEY to use real Claude quiz generation
python app.py                # http://localhost:5001
```

### 2. server (Express)

```bash
cd server
npm install
cp .env.example .env        # all vars optional, see comments in the file
npm run seed                 # loads curriculum content into src/data/db.json (run once, or after editing seed content)
npm run dev                   # http://localhost:4000
```

### 3. client (React)

```bash
cd client
npm install
npm run dev                   # http://localhost:5173, proxies /api to the server
```

Open http://localhost:5173, sign up, pick a language, and go.

## Optional environment variables

| Variable | Where | Effect if unset |
|---|---|---|
| `ANTHROPIC_API_KEY` | rag-service | Quiz generation/evaluation uses a mock instead of Claude |
| `JUDGE0_API_URL` / `JUDGE0_API_KEY` | server | Code execution runs locally instead of via Judge0 |
| `JWT_SECRET` | server | Falls back to an insecure dev default (server logs a warning on startup) — set a real value before deploying |
| `QUIZ_PASS_THRESHOLD` | server | Defaults to 70 (%) |

## Re-seeding curriculum content

Edit the JSON files in `server/src/seed/content/`, then re-run:

```bash
cd server && npm run seed
cd ../rag-service && source venv/bin/activate && python ingest.py   # rebuild the RAG index
```

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Monaco Editor, react-markdown
- **API server**: Node.js, Express 5, JWT auth (`jsonwebtoken` + `bcryptjs`), `pdfkit` for certificates
- **RAG service**: Flask, scikit-learn (TF-IDF retrieval), `anthropic` SDK
- **Storage**: a JSON file (no database server, no vector DB server)
