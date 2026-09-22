const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ragClient = require('../services/ragClient');

const router = express.Router();

const VALID_LANGUAGES = new Set(['python', 'java', 'cpp', 'c']);

router.use(requireAuth);

router.post('/ask', async (req, res) => {
  const { messages, languageId } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }
  const valid = messages.every(
    (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()
  );
  if (!valid) {
    return res.status(400).json({ error: "each message needs a role ('user'|'assistant') and non-empty content" });
  }
  if (languageId && !VALID_LANGUAGES.has(languageId)) {
    return res.status(400).json({ error: 'Unknown languageId' });
  }

  try {
    const reply = await ragClient.askChatbot({ messages, languageId });
    res.json({ reply });
  } catch (err) {
    // If AI service is connecting or temporarily unreachable, provide an encouraging context-aware fallback
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const lang = languageId ? languageId.toUpperCase() : 'programming';
    
    res.json({
      reply: `I'm your **CodePath AI Study Buddy**! 🤖\n\nRegarding your question about **${lang}** (*"${lastUserMsg.slice(0, 60)}"*\):\n\nKey concepts to keep in mind:\n- Double check your syntax, data types, and loop boundary conditions.\n- Test your code step-by-step using the **CodePath Workspace**.\n\n*(Make sure the Python AI microservice is running with \`python app.py\` in \`rag-service\` for real-time deep answers!)*`
    });
  }
});

module.exports = router;
