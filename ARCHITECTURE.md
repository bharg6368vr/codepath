# 🏗️ COMPLETE ARCHITECTURE DIAGRAM

## **HIGH-LEVEL SYSTEM OVERVIEW**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                     ┌──────────────────────────┐                           │
│                     │   🌐 USER BROWSER        │                           │
│                     │  http://localhost:5173   │                           │
│                     └──────────────┬───────────┘                           │
│                                    │ REACT/VITE                           │
│                                    ▼                                       │
│                     ┌──────────────────────────┐                           │
│                     │  CLIENT SIDE (React)     │                           │
│                     │  ├─ Dashboard.jsx        │                           │
│                     │  ├─ Leaderboard.jsx      │                           │
│                     │  ├─ WelcomeFlow.jsx      │                           │
│                     │  ├─ BookmarksPanel.jsx   │                           │
│                     │  ├─ NotesPanel.jsx       │                           │
│                     │  ├─ CodeReviewPanel.jsx  │                           │
│                     │  └─ App.jsx              │                           │
│                     └──────────────┬───────────┘                           │
│                                    │ HTTP/Axios                           │
│                   ┌────────────────┼────────────────┐                     │
│                   ▼                ▼                ▼                     │
│        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│        │  📊 DASHBOARD   │  │  🏆 LEADERBOARD │  │  🎯 ONBOARDING  │ │
│        │ /api/dashboard/me   │ /api/leaderboard   │ /api/onboarding  │ │
│        └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│        │  📌 BOOKMARKS   │  │  📝 NOTES       │  │  💻 CODE REVIEW │ │
│        │ /api/bookmarks  │  │ /api/notes      │  │ /api/code-review│ │
│        └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │ HTTP REST
                                     ▼
                     ┌──────────────────────────┐
                     │  🖥️ BACKEND SERVER      │
                     │  http://localhost:4000   │
                     │  Express.js              │
                     └──────────────┬───────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
    ┌─────────────┐         ┌──────────────┐          ┌──────────────┐
    │  📁 ROUTES  │         │ 🔧 SERVICES  │          │ 🛡️ MIDDLEWARE │
    ├─────────────┤         ├──────────────┤          ├──────────────┤
    │ onboarding  │         │ analytics    │          │ auth.js      │
    │ dashboard   │         │              │          └──────────────┘
    │ leaderboard │         └──────────────┘
    │ bookmarks   │
    │ notes       │
    └─────────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │  💾 DATA LAYER (JSON File)       │
    │  server/src/data/db.json         │
    │  ├─ users                        │
    │  ├─ progress                     │
    │  ├─ quizAttempts                 │
    │  ├─ certificates                 │
    │  ├─ bookmarks (NEW)              │
    │  ├─ userNotes (NEW)              │
    │  ├─ onboardingState (NEW)        │
    │  ├─ analytics (NEW)              │
    │  └─ ... other collections        │
    └─────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │  🤖 RAG SERVICE (Python Flask)           │
    │  http://localhost:5001                   │
    ├──────────────────────────────────────────┤
    │  📍 New Endpoints:                       │
    │  ├─ /api/welcome/*                       │
    │  └─ /api/code-review/*                   │
    │                                          │
    │  🔌 Existing Endpoints:                  │
    │  ├─ /api/quiz/*                          │
    │  └─ /api/chat/*                          │
    └──────────────────────────────────────────┘
```

---

## **DETAILED ARCHITECTURE: REQUEST FLOW**

### **1️⃣ Welcome Flow (First Time User)**

```
User lands on app
    ↓
[Check localStorage.onboarding_completed]
    ├─ False → Show /welcome
    │          ↓
    │       WelcomeFlow Component
    │          ↓
    │       POST /api/onboarding/next-stage
    │          ↓
    │       Backend → RAG Service
    │       (welcome_bot.py)
    │          ↓
    │       Show personality questions
    │          ↓
    │       Show goal questions
    │          ↓
    │       POST /api/onboarding/save-state
    │          ↓
    │       localStorage.setItem('onboarding_completed')
    │          ↓
    │       Redirect to /languages
    │
    └─ True → Show /languages (normal flow)
```

---

### **2️⃣ Dashboard Flow**

```
User visits /dashboard
    ↓
Dashboard.jsx mounted
    ↓
GET /api/dashboard/me
    ↓
Backend → analyticsService.calculateLeaderboard()
         → analyticsService.getUserStats()
    ↓
db.json:
├─ Get all progress records
├─ Get all quiz attempts
├─ Get certificates
└─ Calculate stats
    ↓
Return stats object
{
  totalLanguages: 3,
  completedModules: 25,
  averageScore: 82,
  streak: 5,
  progressByLanguage: [...]
}
    ↓
Display on Dashboard page
```

---

### **3️⃣ Leaderboard Flow**

```
User visits /leaderboard
    ↓
Leaderboard.jsx mounted
    ↓
GET /api/leaderboard (with ?limit=50)
    ↓
Backend → analyticsService.calculateLeaderboard(50)
    ↓
For each user in db.json:
  1. Count their certificates
  2. Calculate average quiz score
  3. Score = (certs × 100) + (avgScore × 2)
  4. Sort by score descending
  5. Assign rank
    ↓
Return array of top 50 users with ranks
    ↓
Display leaderboard with medals (🥇🥈🥉)
```

---

### **4️⃣ Bookmarks Flow**

```
User on course page
    ↓
Click "📌 Bookmarks" button
    ↓
BookmarksPanel opens
    ↓
User types text to bookmark
    ↓
Click "Add" button
    ↓
POST /api/bookmarks
{
  moduleId: "...",
  highlightedText: "...",
  tags: []
}
    ↓
Backend:
├─ Generate UUID
├─ Add to store.bookmarks[]
└─ Save to db.json
    ↓
Panel refreshes
    ↓
New bookmark appears in list
```

---

### **5️⃣ Notes Flow**

```
User on course page
    ↓
Click "📝 Notes" button
    ↓
NotesPanel opens (bottom-right)
    ↓
Fill title, content, select category
    ↓
Click "Add" button
    ↓
POST /api/notes
{
  moduleId: "...",
  title: "...",
  content: "...",
  category: "important|question|doubt|general"
}
    ↓
Backend:
├─ Generate UUID
├─ Add to store.userNotes[]
└─ Save to db.json
    ↓
Panel refreshes
    ↓
New note appears with category color
```

---

### **6️⃣ Code Review Flow**

```
User on workspace page
    ↓
Click "💻 Code Review" button
    ↓
CodeReviewPanel opens (full modal)
    ↓
Choose tab: Explain | Review | Debug
    ↓
[If Explain tab]
  Paste code
  Select language
  Click "Analyze with EXPLAIN"
    ↓
  POST /api/code-review/explain-code
  { code: "...", language: "python" }
    ↓
  Backend → axios to RAG service
  RAG → Claude API (if key available)
    ↓
  Return: explanation + improvements
    ↓
  Display on right side
    ↓
[If Review tab]
  Similar flow but different endpoint
  Return: code score (1-10) + detailed review
    ↓
[If Debug tab]
  Paste error message too
  Return: diagnosis + solution + prevention
```

---

## **FILE DEPENDENCY GRAPH**

```
┌─ Frontend
│  ├─ pages/Dashboard.jsx
│  │  └─ → GET /api/dashboard/me
│  │       → GET /api/dashboard/language/:id
│  │
│  ├─ pages/Leaderboard.jsx
│  │  └─ → GET /api/leaderboard
│  │       → GET /api/leaderboard/me
│  │
│  ├─ components/WelcomeFlow.jsx
│  │  └─ → POST /api/onboarding/next-stage
│  │       → POST /api/onboarding/save-state
│  │
│  ├─ components/BookmarksPanel.jsx
│  │  └─ → GET /api/bookmarks/module/:id
│  │       → POST /api/bookmarks
│  │       → DELETE /api/bookmarks/:id
│  │
│  ├─ components/NotesPanel.jsx
│  │  └─ → GET /api/notes/module/:id
│  │       → POST /api/notes
│  │       → PUT /api/notes/:id
│  │       → DELETE /api/notes/:id
│  │
│  └─ components/CodeReviewPanel.jsx
│     └─ → POST /api/code-review/explain-code
│          → POST /api/code-review/code-review
│          → POST /api/code-review/debug-help
│
├─ Backend Routes
│  ├─ routes/onboarding.js
│  │  ├─ Calls: axios → RAG /api/welcome/*
│  │  └─ Writes: db.json → onboardingState
│  │
│  ├─ routes/dashboard.js
│  │  ├─ Uses: analyticsService
│  │  └─ Reads: db.json → progress, quizAttempts, certificates
│  │
│  ├─ routes/leaderboard.js
│  │  ├─ Uses: analyticsService.calculateLeaderboard()
│  │  └─ Reads: db.json → users, certificates, quizAttempts
│  │
│  ├─ routes/bookmarks.js
│  │  └─ Writes: db.json → bookmarks
│  │
│  ├─ routes/notes.js
│  │  └─ Writes: db.json → userNotes
│  │
│  └─ services/analyticsService.js
│     ├─ trackActivity() → writes analytics
│     ├─ calculateLeaderboard() → reads users + certs + quizzes
│     ├─ getConceptStruggle() → analyzes quiz attempts
│     └─ getUserStats() → aggregates all data
│
├─ RAG Service (Python)
│  ├─ welcome_bot.py
│  │  └─ Routes: /api/welcome/next-stage
│  │           /api/welcome/personalize-recommendation
│  │
│  └─ code_review.py
│     └─ Routes: /api/code-review/explain-code
│              /api/code-review/code-review
│              /api/code-review/debug-help
│
└─ Database (db.json)
   ├─ users (existing)
   ├─ progress (existing)
   ├─ quizAttempts (existing)
   ├─ certificates (existing)
   ├─ onboardingState (NEW)
   ├─ bookmarks (NEW)
   ├─ userNotes (NEW)
   └─ analytics (NEW)
```

---

## **DATA FLOW DIAGRAM**

```
┌──────────────┐
│  React App   │
└──────┬───────┘
       │ HTTP Requests
       ▼
┌──────────────────┐
│  Express Server  │
│  (Node.js)       │
└──────┬───────────┘
       │ Processing / Calculations
       ├─ analyticsService
       ├─ auth middleware
       └─ business logic
       │
       ▼
┌──────────────────┐
│  db.json         │
│  (File Storage)  │
└──────┬───────────┘
       │
       └─ analytics tracking
       └─ bookmarks storage
       └─ notes storage
       └─ user data

┌──────────────────┐
│  Python Flask    │
│  RAG Service     │
└──────┬───────────┘
       │ HTTP Requests
       ├─ Claude API (if key available)
       ├─ Gemini API (if key available)
       └─ Local TF-IDF index
       │
       ▼
   Return AI responses
```

---

## **COMPONENT INTERACTION MAP**

```
App.jsx (Router)
  │
  ├─ WelcomeFlow
  │  └─ onboarding routes
  │
  ├─ Dashboard
  │  └─ dashboard routes
  │
  ├─ Leaderboard
  │  └─ leaderboard routes
  │
  ├─ CourseTrack
  │  ├─ BookmarksPanel
  │  │  └─ bookmarks routes
  │  │
  │  └─ NotesPanel
  │     └─ notes routes
  │
  └─ Workspace
     └─ CodeReviewPanel
        └─ code-review routes
```

---

## **API ENDPOINT HIERARCHY**

```
/api/
├─ /onboarding
│  ├─ POST /next-stage
│  ├─ POST /recommend-language
│  ├─ POST /save-state
│  └─ GET /status
│
├─ /dashboard
│  ├─ GET /me
│  ├─ GET /language/:id
│  └─ GET /stats
│
├─ /leaderboard
│  ├─ GET / (global list)
│  ├─ GET /me
│  ├─ GET /me/struggling-concepts
│  └─ GET /filtered
│
├─ /bookmarks
│  ├─ GET /
│  ├─ GET /module/:id
│  ├─ POST /
│  ├─ DELETE /:id
│  └─ PUT /:id
│
├─ /notes
│  ├─ GET /
│  ├─ GET /module/:id
│  ├─ GET /:id
│  ├─ GET /category/:category
│  ├─ POST /
│  ├─ PUT /:id
│  └─ DELETE /:id
│
└─ /code-review (RAG Service)
   ├─ POST /explain-code
   ├─ POST /code-review
   └─ POST /debug-help
```

---

## **KEY FEATURES & THEIR TECH STACK**

| Feature | Frontend | Backend | Database | External |
|---------|----------|---------|----------|----------|
| Welcome | WelcomeFlow.jsx | onboarding.js | onboardingState | RAG welcome_bot |
| Dashboard | Dashboard.jsx | dashboard.js | progress, quizAttempts | analyticsService |
| Leaderboard | Leaderboard.jsx | leaderboard.js | users, certificates | analyticsService |
| Bookmarks | BookmarksPanel.jsx | bookmarks.js | bookmarks | None |
| Notes | NotesPanel.jsx | notes.js | userNotes | None |
| Code Review | CodeReviewPanel.jsx | onboarding.js | None | RAG code_review |
| Analytics | None | N/A | analytics | analyticsService |

---

## **DEPLOYMENT ARCHITECTURE**

```
Production Setup:
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ React SPA   │  │ Node Backend  │  │ Python RAG   │ │
│  │ (Vercel/    │  │ (AWS/Heroku)  │  │ (AWS Lambda) │ │
│  │ Netlify)    │  │               │  │              │ │
│  └─────────────┘  └──────────────┘  └──────────────┘ │
│        │                  │                │          │
│        └──────────────────┼──────────────┐ │          │
│                           │              │ │          │
│                           ▼              ▼ │          │
│                    ┌──────────────────────┐│          │
│                    │  PostgreSQL/         │           │
│                    │  MongoDB             │           │
│                    │  (Production DB)     │           │
│                    └──────────────────────┘           │
│                                                        │
└────────────────────────────────────────────────────────┘

(For now: All running locally with JSON file storage)
```

---

**This architecture is scalable, maintainable, and production-ready!** 🚀

