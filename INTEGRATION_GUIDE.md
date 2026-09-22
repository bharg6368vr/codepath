# 🚀 COMPLETE INTEGRATION GUIDE

This guide shows **EXACTLY** where to add the new files and **HOW** to wire them into your existing project.

---

## **STEP 1: Register RAG Service Routes (in `rag-service/app.py`)**

**What to do:** Add these 2 lines to your existing `app.py` file

```python
# Find this section in app.py:
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# ADD THESE TWO LINES AFTER CORS(app):
from welcome_bot import welcome_bp
from code_review import code_review_bp

# Then find where routes are registered (bottom of file, before if __name__)
# ADD THESE TWO LINES:
app.register_blueprint(welcome_bp, url_prefix='/api/welcome')
app.register_blueprint(code_review_bp, url_prefix='/api/code-review')

# That's it! No other changes needed in app.py
```

**Result:** Your RAG service will now have:
- `/api/welcome/next-stage` (POST)
- `/api/welcome/personalize-recommendation` (POST)
- `/api/code-review/explain-code` (POST)
- `/api/code-review/code-review` (POST)
- `/api/code-review/debug-help` (POST)

---

## **STEP 2: Register Backend Routes (in `server/src/index.js`)**

**What to do:** Find this section in your `server/src/index.js`:

```javascript
// Look for where other routes are registered (usually near the bottom)
// It looks like this:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/languages', require('./routes/languages'));
// ... other routes

// ADD THESE 5 NEW LINES:
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/notes', require('./routes/notes'));
```

**Result:** Your backend will now have all these new API endpoints ready.

---

## **STEP 3: Update Client App Routes (in `client/src/App.jsx`)**

**What to do:** Add imports and routes to your existing `App.jsx`

First, find the imports section at the top and add:

```jsx
import WelcomeFlow from './components/WelcomeFlow';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import { useState } from 'react';
```

Then, find where your routes are defined (inside the `<Routes>` tag) and add:

```jsx
// ADD THESE ROUTES (preferably before existing routes)

{/* Welcome Flow - Shows only once on first visit */}
{!localStorage.getItem('onboarding_completed') && (
  <Route
    path="/welcome"
    element={
      <WelcomeFlow
        onComplete={() => {
          localStorage.setItem('onboarding_completed', 'true');
          window.location.href = '/languages'; // Redirect to language selection
        }}
      />
    }
  />
)}

{/* Dashboard Route */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

{/* Leaderboard Route (public) */}
<Route path="/leaderboard" element={<Leaderboard />} />
```

**Note:** If you want to show welcome on first login, modify your Home.jsx or Login.jsx to redirect to `/welcome` after signup.

---

## **STEP 4: Update Navbar (in `client/src/components/Navbar.jsx`)**

**What to do:** Add links to new pages in your navigation

Find your navbar and add these links:

```jsx
{/* Add these to your navbar menu */}
<Link to="/dashboard" className="navbar-link">📊 Dashboard</Link>
<Link to="/leaderboard" className="navbar-link">🏆 Leaderboard</Link>
```

---

## **STEP 5: Add Analytics Tracking (Optional but Recommended)**

### **In Course Completion:**
Edit `server/src/routes/progress.js` and add at the bottom:

```javascript
const AnalyticsService = require('../services/analyticsService');

// After marking module complete, add:
AnalyticsService.trackActivity(req.user.id, 'module_completed', {
  languageId: req.params.languageId,
  moduleId: req.params.moduleId
});
```

### **In Quiz Submission:**
Edit `server/src/routes/quiz.js` and add at the bottom:

```javascript
const AnalyticsService = require('../services/analyticsService');

// After calculating quiz score, add:
AnalyticsService.trackActivity(req.user.id, 'quiz_submitted', {
  languageId: quiz.languageId,
  score: finalScore,
  questionCount: quiz.questions.length
});
```

### **In Certificate Issuance:**
Edit `server/src/routes/certificate.js` and add:

```javascript
const AnalyticsService = require('../services/analyticsService');

// After creating certificate, add:
AnalyticsService.trackActivity(req.user.id, 'certificate_earned', {
  languageId: certificate.languageId,
  score: certificate.score,
  certificateId: certificate.certificateId
});
```

---

## **STEP 6: (Optional) Add Components to Existing Pages**

### **To Add Bookmarks to CourseTrack.jsx:**

```jsx
import BookmarksPanel from '../components/BookmarksPanel';
import { useState } from 'react';

export default function CourseTrack() {
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  // ... existing code

  return (
    <div>
      {/* Add button in your toolbar */}
      <button onClick={() => setBookmarksOpen(!bookmarksOpen)} className="btn">
        📌 Bookmarks
      </button>

      {/* Add component */}
      <BookmarksPanel 
        moduleId={currentModuleId} 
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
      />

      {/* ... rest of component */}
    </div>
  );
}
```

### **To Add Notes to CourseTrack.jsx:**

```jsx
import NotesPanel from '../components/NotesPanel';
import { useState } from 'react';

export default function CourseTrack() {
  const [notesOpen, setNotesOpen] = useState(false);
  // ... existing code

  return (
    <div>
      {/* Add button */}
      <button onClick={() => setNotesOpen(!notesOpen)} className="btn">
        📝 Notes
      </button>

      {/* Add component */}
      <NotesPanel 
        moduleId={currentModuleId} 
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />

      {/* ... rest of component */}
    </div>
  );
}
```

### **To Add Code Review to Workspace.jsx:**

```jsx
import CodeReviewPanel from '../components/CodeReviewPanel';
import { useState } from 'react';

export default function Workspace() {
  const [reviewOpen, setReviewOpen] = useState(false);
  // ... existing code

  return (
    <div>
      {/* Add button in toolbar */}
      <button onClick={() => setReviewOpen(true)} className="btn">
        💻 Code Review
      </button>

      {/* Add component */}
      <CodeReviewPanel 
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />

      {/* ... rest of component */}
    </div>
  );
}
```

---

## **STEP 7: Update Database Schema (One-Time Setup)**

Your `server/src/data/db.json` will automatically create these collections on first use:
- `onboardingState`
- `bookmarks`
- `userNotes`
- `discussions` (reserved for future)
- `leaderboardStats` (calculated dynamically)
- `analytics`

**No manual changes needed** - they'll be created automatically when users interact with features.

---

## **STEP 8: Test Everything**

### **Test Onboarding Flow:**
1. Clear localStorage: `localStorage.removeItem('onboarding_completed')`
2. Visit `http://localhost:5173/`
3. Should redirect to welcome flow

### **Test Dashboard:**
1. Login as any user
2. Visit `http://localhost:5173/dashboard`
3. Should show stats and language progress

### **Test Leaderboard:**
1. Visit `http://localhost:5173/leaderboard` (no login needed)
2. Should show top 10 users

### **Test Bookmarks:**
1. Click bookmark button on course page
2. Try adding a bookmark
3. Should appear in panel

### **Test Code Review:**
1. Click code review button on workspace
2. Paste code and click "Analyze"
3. Should show explanation/review/debug help

---

## **TROUBLESHOOTING**

### **Issue: "Module not found" error**

**Solution:** Make sure files are in correct directories:
```
rag-service/
  ├── app.py (existing)
  ├── welcome_bot.py (NEW)
  └── code_review.py (NEW)

server/
  └── src/
      ├── index.js (existing)
      ├── services/
      │   └── analyticsService.js (NEW)
      └── routes/
          ├── onboarding.js (NEW)
          ├── dashboard.js (NEW)
          ├── leaderboard.js (NEW)
          ├── bookmarks.js (NEW)
          └── notes.js (NEW)

client/
  └── src/
      ├── App.jsx (existing - modified)
      ├── components/
      │   ├── WelcomeFlow.jsx (NEW)
      │   ├── BookmarksPanel.jsx (NEW)
      │   ├── NotesPanel.jsx (NEW)
      └── pages/
          ├── Dashboard.jsx (NEW)
          └── Leaderboard.jsx (NEW)
```

### **Issue: "Cannot POST /api/..." errors**

**Solution:** Make sure you registered routes in Step 2. Routes must be registered in `server/src/index.js` BEFORE `app.listen()`

### **Issue: RAG service endpoints not responding**

**Solution:** 
1. Make sure welcome_bot.py and code_review.py are in `rag-service/` folder
2. Check `rag-service/app.py` has the blueprint registrations
3. Restart RAG service: `python app.py`

### **Issue: Analytics not tracking**

**Solution:** Make sure you added the `AnalyticsService.trackActivity()` calls in quiz/progress/certificate routes

---

## **WHAT YOU GET NOW:**

✅ **Interactive Welcome** - Personalized onboarding flow on first visit
✅ **Dashboard** - See all your progress stats and language tracking
✅ **Leaderboard** - Global rankings and competition
✅ **Bookmarks** - Highlight important concepts while learning
✅ **Notes** - Create and organize notes per module
✅ **Code Review** - Get AI feedback on your code
✅ **Analytics** - Track user activity and engagement

---

## **QUICK REFERENCE: All New Files Created**

| File | Purpose |
|------|---------|
| `rag-service/welcome_bot.py` | Welcome conversation flow |
| `rag-service/code_review.py` | Code review, explain, debug endpoints |
| `server/src/services/analyticsService.js` | Analytics and leaderboard logic |
| `server/src/routes/onboarding.js` | Onboarding API endpoints |
| `server/src/routes/dashboard.js` | Dashboard API endpoints |
| `server/src/routes/leaderboard.js` | Leaderboard API endpoints |
| `server/src/routes/bookmarks.js` | Bookmarks API endpoints |
| `server/src/routes/notes.js` | Notes API endpoints |
| `client/src/components/WelcomeFlow.jsx` | Welcome UI |
| `client/src/components/BookmarksPanel.jsx` | Bookmarks UI |
| `client/src/components/NotesPanel.jsx` | Notes UI |
| `client/src/components/CodeReviewPanel.jsx` | Code Review UI |
| `client/src/pages/Dashboard.jsx` | Dashboard page |
| `client/src/pages/Leaderboard.jsx` | Leaderboard page |

---

## **NEXT STEPS**

1. ✅ Copy all files created above
2. ✅ Follow Step 1-8 above to integrate them
3. ✅ Test each feature as you go
4. ✅ Customize colors/text/functionality as needed
5. ✅ Deploy and enjoy! 🚀

