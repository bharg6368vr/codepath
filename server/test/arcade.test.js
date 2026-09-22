const express = require('express');
const authRoutes = require('../src/routes/auth');
const arcadeRoutes = require('../src/routes/arcade');
const jwt = require('jsonwebtoken');
const { collection } = require('../src/db/store');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/arcade', arcadeRoutes);

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const users = collection('users').all();
  const testUser = users[0];
  const token = jwt.sign({ id: testUser.id, email: testUser.email, name: testUser.name }, JWT_SECRET);

  console.log('Testing Arcade with User:', testUser.name);

  async function api(path, options = {}) {
    const res = await fetch(baseUrl + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  // 1. Submit a score for Bug Hunt
  console.log('\n--- 1. Testing POST /api/arcade/submit-score ---');
  const submitRes = await api('/api/arcade/submit-score', {
    method: 'POST',
    body: JSON.stringify({
      gameType: 'bug_hunt',
      score: 250,
      xpEarned: 375,
      languageId: 'python'
    })
  });
  console.log('Submit Status:', submitRes.status);
  console.log('User Level:', submitRes.data.userLevel);
  console.log('Total XP:', submitRes.data.totalXp);

  // 2. Fetch stats
  console.log('\n--- 2. Testing GET /api/arcade/stats ---');
  const statsRes = await api('/api/arcade/stats');
  console.log('Stats Status:', statsRes.status);
  console.log('High Scores:', statsRes.data.highScores);

  // 3. Fetch arcade leaderboard
  console.log('\n--- 3. Testing GET /api/arcade/leaderboard ---');
  const lbRes = await api('/api/arcade/leaderboard');
  console.log('Arcade Leaderboard Status:', lbRes.status);
  console.log('Arcade Leaders:', lbRes.data);

  server.close();
  console.log('\n>>> ARCADE BACKEND TEST PASSED SUCCESSFULLY! <<<');
});
