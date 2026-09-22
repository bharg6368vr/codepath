const express = require('express');
const chatRoutes = require('../src/routes/chat');
const codeReviewRoutes = require('../src/routes/codeReview');
const jwt = require('jsonwebtoken');
const { collection } = require('../src/db/store');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);
app.use('/api/code-review', codeReviewRoutes);

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const users = collection('users').all();
  const testUser = users[0];
  const token = jwt.sign({ id: testUser.id, email: testUser.email, name: testUser.name }, JWT_SECRET);

  console.log('Testing End-to-End AI with User:', testUser.name);

  // 1. Test Chatbot AI proxy
  console.log('\n--- 1. Testing POST /api/chat/ask ---');
  try {
    const res = await fetch(baseUrl + '/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is an array in Java?' }],
        languageId: 'java'
      })
    });
    console.log('Chatbot Status:', res.status);
    const data = await res.json();
    console.log('Chatbot Reply:', data.reply?.slice(0, 120) + '...');
  } catch (e) {
    console.log('Chatbot Error (service offline fallback):', e.message);
  }

  // 2. Test Code Review AI proxy
  console.log('\n--- 2. Testing POST /api/code-review/explain-code ---');
  try {
    const res = await fetch(baseUrl + '/api/code-review/explain-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        code: 'def is_even(n): return n % 2 == 0',
        language: 'python'
      })
    });
    console.log('Explain Code Status:', res.status);
    const data = await res.json();
    console.log('Explanation:', data.explanation?.slice(0, 120) + '...');
  } catch (e) {
    console.log('Explain Code Error:', e.message);
  }

  server.close();
  console.log('\n>>> END-TO-END AI VERIFICATION COMPLETE! <<<');
});
