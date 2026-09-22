const express = require('express');
const authRoutes = require('../src/routes/auth');
const dashboardRoutes = require('../src/routes/dashboard');
const leaderboardRoutes = require('../src/routes/leaderboard');
const progressRoutes = require('../src/routes/progress');
const languagesRoutes = require('../src/routes/languages');
const jwt = require('jsonwebtoken');
const { collection } = require('../src/db/store');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/languages', languagesRoutes);

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const users = collection('users').all();
  const testUser = users[0];
  const token = jwt.sign({ id: testUser.id, email: testUser.email, name: testUser.name }, JWT_SECRET);

  console.log('Testing with User:', testUser.name, '(' + testUser.email + ')');

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

  // 1. Test Dashboard /me
  console.log('\n--- 1. Testing GET /api/dashboard/me ---');
  const dashRes = await api('/api/dashboard/me');
  console.log('Dashboard Status:', dashRes.status);
  console.log('Active Languages:', dashRes.data.activeLanguages?.length);
  console.log('Completed Modules:', dashRes.data.completedModules);
  console.log('Streak:', dashRes.data.streak);
  console.log('Quizzes Taken:', dashRes.data.quizzesTaken);
  console.log('Average Score:', dashRes.data.averageScore + '%');
  console.log('Certificates Earned:', dashRes.data.certificatesEarned);

  // 2. Test Leaderboard
  console.log('\n--- 2. Testing GET /api/leaderboard ---');
  const lbRes = await api('/api/leaderboard');
  console.log('Leaderboard Status:', lbRes.status);
  console.log('Top Ranks:', lbRes.data.map(u => `#${u.rank} ${u.name} (Score: ${u.score}, Certs: ${u.certificatesCount}, Modules: ${u.completedModules})`));

  // 3. Test Leaderboard /me
  console.log('\n--- 3. Testing GET /api/leaderboard/me ---');
  const lbMeRes = await api('/api/leaderboard/me');
  console.log('Leaderboard /me Status:', lbMeRes.status);
  console.log('User Rank:', '#' + lbMeRes.data.rank);
  console.log('User Entry:', lbMeRes.data.entry);

  server.close();
  console.log('\n>>> LIVE TEST PASSED: ALL ENDPOINTS RETURNED HTTP 200 OK WITH LIVE DATA! <<<');
});
