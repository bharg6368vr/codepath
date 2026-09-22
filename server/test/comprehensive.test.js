const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { collection, getStore, updateStore } = require('../src/db/store');
const { JWT_SECRET } = require('../src/middleware/auth');

// Import all routes
const authRoutes = require('../src/routes/auth');
const languageRoutes = require('../src/routes/languages');
const progressRoutes = require('../src/routes/progress');
const quizRoutes = require('../src/routes/quiz');
const certificateRoutes = require('../src/routes/certificate');
const compilerRoutes = require('../src/routes/compiler');
const chatRoutes = require('../src/routes/chat');
const dashboardRoutes = require('../src/routes/dashboard');
const leaderboardRoutes = require('../src/routes/leaderboard');
const bookmarksRoutes = require('../src/routes/bookmarks');
const notesRoutes = require('../src/routes/notes');
const onboardingRoutes = require('../src/routes/onboarding');
const codeReviewRoutes = require('../src/routes/codeReview');
const arcadeRoutes = require('../src/routes/arcade');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/code-review', codeReviewRoutes);
app.use('/api/arcade', arcadeRoutes);

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passedCount++;
    } else {
      console.error(`  ✗ FAILED: ${message}`);
      failedCount++;
    }
  }

  // Create a dedicated test user
  const testUserId = uuidv4();
  const testUser = {
    id: testUserId,
    name: 'Auditor Test User',
    email: `auditor_${Date.now()}@codepath.test`,
  };
  const token = jwt.sign(testUser, JWT_SECRET);

  async function api(path, options = {}) {
    const res = await fetch(baseUrl + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  }

  console.log('====================================================');
  console.log('STARTING POINT-TO-POINT COMPREHENSIVE SYSTEM AUDIT');
  console.log('====================================================\n');

  try {
    // 1. Health
    console.log('[1/14] Testing Health Endpoint:');
    const health = await api('/api/health');
    assert(health.status === 200 && health.data?.status === 'ok', 'GET /api/health returns status: ok');

    // 2. Languages
    console.log('\n[2/14] Testing Languages & Modules:');
    const langs = await api('/api/languages');
    assert(langs.status === 200 && Array.isArray(langs.data) && langs.data.length >= 4, 'GET /api/languages returns all 4 tracks');
    
    const pyModules = await api('/api/languages/python/modules');
    assert(pyModules.status === 200 && Array.isArray(pyModules.data) && pyModules.data.length > 0, 'GET /api/languages/python/modules returns module list');
    const firstModuleId = pyModules.data[0].id;

    const enroll = await api('/api/languages/python/enroll', { method: 'POST' });
    assert(enroll.status === 200, 'POST /api/languages/python/enroll successfully enrolls user');

    // 3. Progress
    console.log('\n[3/14] Testing Progress Tracking:');
    const prog = await api('/api/progress/python');
    assert(prog.status === 200 && prog.data.languageId === 'python', 'GET /api/progress/python returns user progress record');

    const markMod = await api(`/api/progress/python/complete-module/${firstModuleId}`, { method: 'POST' });
    assert(markMod.status === 200 && markMod.data.completedModuleIds?.includes(firstModuleId), 'POST /api/progress/python/complete-module/:id marks module completed');

    // 4. Dashboard
    console.log('\n[4/14] Testing Dashboard:');
    const dash = await api('/api/dashboard/me');
    assert(dash.status === 200, 'GET /api/dashboard/me returns 200 OK');
    assert(dash.data.activeLanguages?.length > 0, 'Dashboard identifies active user languages');
    assert(typeof dash.data.streak === 'number', 'Dashboard computes streak correctly');

    const dashLang = await api('/api/dashboard/language/python');
    assert(dashLang.status === 200 && Array.isArray(dashLang.data.modules), 'GET /api/dashboard/language/python returns detailed module checklist');

    const toggleMod = await api(`/api/dashboard/modules/${firstModuleId}/toggle`, { method: 'POST' });
    assert(toggleMod.status === 200, 'POST /api/dashboard/modules/:id/toggle toggles completion cleanly');

    // 5. Leaderboard
    console.log('\n[5/14] Testing Global & Personal Leaderboard:');
    const lb = await api('/api/leaderboard');
    assert(lb.status === 200 && Array.isArray(lb.data), 'GET /api/leaderboard returns array of ranked learners');

    const lbMe = await api('/api/leaderboard/me');
    assert(lbMe.status === 200, 'GET /api/leaderboard/me returns user ranking info');

    const struggling = await api('/api/leaderboard/me/struggling-concepts');
    assert(struggling.status === 200 && Array.isArray(struggling.data), 'GET /api/leaderboard/me/struggling-concepts returns concepts array');

    // 6. Quizzes
    console.log('\n[6/14] Testing Quiz Generation & Evaluation:');
    const genQuiz = await api('/api/quiz/python/generate', { method: 'POST' });
    assert(genQuiz.status === 200 && Array.isArray(genQuiz.data.questions) && genQuiz.data.questions.length === 10, 'POST /api/quiz/python/generate generates 10-question quiz (with live fallback)');
    const attemptId = genQuiz.data.attemptId;
    const questions = genQuiz.data.questions;

    // Build answers
    const answers = {};
    questions.forEach(q => {
      answers[q.id] = q.options ? q.options[0] : '8';
    });

    const submitQuiz = await api(`/api/quiz/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
    assert(submitQuiz.status === 200 && typeof submitQuiz.data.score === 'number', 'POST /api/quiz/:id/submit grades quiz and returns score & feedback');

    // 7. Certificates & Verification
    console.log('\n[7/14] Testing Certificates & Verification:');
    // Ensure user has passed quiz to claim cert
    const quizAttemptsColl = collection('quizAttempts');
    quizAttemptsColl.insert({
      id: uuidv4(),
      userId: testUserId,
      languageId: 'python',
      passed: true,
      score: 95,
      generatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    });

    const issueCert = await api('/api/certificate/python/issue', { method: 'POST' });
    assert(issueCert.status === 200 || issueCert.status === 201, 'POST /api/certificate/python/issue issues verifiable certificate');
    const certId = issueCert.data.certificateId;

    const getCert = await api('/api/certificate/python/me');
    assert(getCert.status === 200 && getCert.data.certificateId === certId, 'GET /api/certificate/python/me returns certificate metadata');

    const verifyCert = await api(`/api/certificate/${certId}`);
    assert(verifyCert.status === 200 && verifyCert.data.certificateId === certId, 'GET /api/certificate/:certId provides public verification');

    // 8. Arcade / Games
    console.log('\n[8/14] Testing Arcade Games & XP:');
    const arcadeSubmit = await api('/api/arcade/submit-score', {
      method: 'POST',
      body: JSON.stringify({ gameType: 'bug_hunt', score: 300, xpEarned: 450, languageId: 'python' })
    });
    assert(arcadeSubmit.status === 200 && arcadeSubmit.data.totalXp >= 450, 'POST /api/arcade/submit-score awards XP and levels');

    const arcadeStats = await api('/api/arcade/stats');
    assert(arcadeStats.status === 200 && arcadeStats.data.highScores?.bugHunt >= 300, 'GET /api/arcade/stats returns high scores');

    const arcadeLb = await api('/api/arcade/leaderboard');
    assert(arcadeLb.status === 200 && Array.isArray(arcadeLb.data), 'GET /api/arcade/leaderboard returns arcade ranking');

    // 9. Compiler Workspace
    console.log('\n[9/14] Testing Coding Workspace & Compiler:');
    const problems = await api('/api/compiler/problems/python');
    assert(problems.status === 200 && Array.isArray(problems.data), 'GET /api/compiler/problems/python returns practice problems');

    const runPy = await api('/api/compiler/run', {
      method: 'POST',
      body: JSON.stringify({ language: 'python', code: 'print("CodePath Verified")', stdin: '' })
    });
    assert(runPy.status === 200 && runPy.data.stdout?.includes('CodePath Verified'), 'POST /api/compiler/run executes Python code');

    // 10. Bookmarks
    console.log('\n[10/14] Testing Bookmarks:');
    const addBm = await api('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ moduleId: firstModuleId, highlightedText: 'Indentation is syntax', pageNumber: 0, tags: ['core'] })
    });
    assert(addBm.status === 201, 'POST /api/bookmarks creates bookmark');
    const bmId = addBm.data.id;

    const listBm = await api(`/api/bookmarks/module/${firstModuleId}`);
    assert(listBm.status === 200 && listBm.data.length > 0, 'GET /api/bookmarks/module/:id lists bookmarks');

    const delBm = await api(`/api/bookmarks/${bmId}`, { method: 'DELETE' });
    assert(delBm.status === 200, 'DELETE /api/bookmarks/:id removes bookmark');

    // 11. Notes
    console.log('\n[11/14] Testing Study Notes:');
    const addNote = await api('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ moduleId: firstModuleId, title: 'Python loops', content: 'for x in range(10)', category: 'general' })
    });
    assert(addNote.status === 201, 'POST /api/notes creates note');
    const noteId = addNote.data.id;

    const listNotes = await api(`/api/notes/module/${firstModuleId}`);
    assert(listNotes.status === 200 && listNotes.data.length > 0, 'GET /api/notes/module/:id retrieves notes');

    const updateNote = await api(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({ content: 'Updated note content' })
    });
    assert(updateNote.status === 200 && updateNote.data.content === 'Updated note content', 'PUT /api/notes/:id updates note');

    const delNote = await api(`/api/notes/${noteId}`, { method: 'DELETE' });
    assert(delNote.status === 200, 'DELETE /api/notes/:id deletes note');

    // 12. Code Review & Debug Assistant
    console.log('\n[12/14] Testing AI Code Review & Debug Assistant:');
    const explain = await api('/api/code-review/explain-code', {
      method: 'POST',
      body: JSON.stringify({ code: 'x = [1, 2, 3]', language: 'python' })
    });
    assert(explain.status === 200 && explain.data.explanation, 'POST /api/code-review/explain-code explains code');

    const review = await api('/api/code-review/code-review', {
      method: 'POST',
      body: JSON.stringify({ code: 'def foo(): pass', language: 'python' })
    });
    assert(review.status === 200 && review.data.review, 'POST /api/code-review/code-review returns code review');

    const debug = await api('/api/code-review/debug-help', {
      method: 'POST',
      body: JSON.stringify({ code: 'x = 1/0', error: 'ZeroDivisionError', language: 'python' })
    });
    assert(debug.status === 200 && debug.data.solution, 'POST /api/code-review/debug-help returns debug solution');

    // 13. Chatbot
    console.log('\n[13/14] Testing AI Chat Widget:');
    const chat = await api('/api/chat/ask', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Explain loops' }], languageId: 'python' })
    });
    assert(chat.status === 200 && typeof chat.data.reply === 'string', 'POST /api/chat/ask returns study buddy answer');

    // 14. Onboarding
    console.log('\n[14/14] Testing Onboarding Flow:');
    const onbPref = await api('/api/onboarding/preferences', {
      method: 'POST',
      body: JSON.stringify({ goal: 'ai', experienceLevel: 'beginner', learningStyle: 'hands_on' })
    });
    assert(onbPref.status === 200, 'POST /api/onboarding/preferences saves user preferences');

  } catch (err) {
    console.error('Unexpected exception during audit:', err);
    failedCount++;
  } finally {
    server.close();
    console.log('\n====================================================');
    console.log(`AUDIT COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log('====================================================');
    if (failedCount > 0) {
      process.exit(1);
    }
  }
});
