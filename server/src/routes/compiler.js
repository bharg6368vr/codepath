const express = require('express');
const problems = require('../seed/content/problems.json');
const { runCode } = require('../services/compilerService');

const router = express.Router();

router.get('/problems/:language', (req, res) => {
  res.json(problems[req.params.language] || []);
});

router.post('/run', async (req, res) => {
  const { language, code, stdin } = req.body || {};
  if (!language || typeof code !== 'string') {
    return res.status(400).json({ error: 'language and code are required' });
  }
  try {
    const result = await runCode(language, code, stdin || '');
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Execution failed' });
  }
});

module.exports = router;
