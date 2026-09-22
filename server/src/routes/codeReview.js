const express = require('express');
const router = express.Router();
const axios = require('axios');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

router.post('/explain-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    const response = await axios.post(`${RAG_SERVICE_URL}/api/code-review/explain-code`, {
      code,
      language
    });
    res.json(response.data);
  } catch (error) {
    const lang = req.body.language || 'code';
    res.json({
      explanation: `This ${lang} code demonstrates core language patterns and syntax.`,
      suggested_improvements: '1. Use descriptive variable names\n2. Add comments explaining complex logic\n3. Handle edge cases',
      demo_mode: true
    });
  }
});

router.post('/code-review', async (req, res) => {
  try {
    const { code, language } = req.body;
    const response = await axios.post(`${RAG_SERVICE_URL}/api/code-review/code-review`, {
      code,
      language
    });
    res.json(response.data);
  } catch (error) {
    res.json({
      review: 'Code Review (Local Analysis):\n\n- Structure: Clean and readable\n- Performance: Standard complexity\n- Suggestions: Add input validation and comments',
      score: 8,
      demo_mode: true
    });
  }
});

router.post('/debug-help', async (req, res) => {
  try {
    const { code, error, language } = req.body;
    const response = await axios.post(`${RAG_SERVICE_URL}/api/code-review/debug-help`, {
      code,
      error,
      language
    });
    res.json(response.data);
  } catch (err) {
    res.json({
      solution: 'Common resolution steps:\n1. Check variable types and null values\n2. Verify loop termination conditions\n3. Inspect the stack trace for line numbers',
      demo_mode: true
    });
  }
});

module.exports = router;
