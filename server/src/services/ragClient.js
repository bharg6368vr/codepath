const axios = require('axios');
const { getFallbackQuiz } = require('../data/fallbackQuizzes');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

async function generateQuiz(languageId) {
  try {
    const { data } = await axios.post(
      `${RAG_SERVICE_URL}/quiz/generate`,
      { languageId },
      { timeout: 8000 }
    );
    if (Array.isArray(data.questions) && data.questions.length > 0) {
      return data.questions;
    }
    return getFallbackQuiz(languageId);
  } catch (err) {
    console.warn(`[ragClient] RAG quiz generation unavailable (${err.message}). Using built-in question bank for ${languageId}.`);
    return getFallbackQuiz(languageId);
  }
}

async function evaluateAnswer({ question, userAnswer, correctAnswer, questionType }) {
  try {
    const { data } = await axios.post(
      `${RAG_SERVICE_URL}/quiz/evaluate`,
      { question, userAnswer, correctAnswer, questionType },
      { timeout: 5000 }
    );
    return data;
  } catch {
    const isCorrect = (userAnswer || '').trim().toLowerCase() === (correctAnswer || '').trim().toLowerCase();
    return {
      verdict: isCorrect ? 'correct' : 'incorrect',
      feedback: isCorrect ? 'Correct!' : `Expected: ${correctAnswer}`
    };
  }
}

async function askChatbot({ messages, languageId }) {
  const { data } = await axios.post(
    `${RAG_SERVICE_URL}/chat/ask`,
    { messages, languageId },
    { timeout: 30000 }
  );
  return data.reply;
}

module.exports = { generateQuiz, evaluateAnswer, askChatbot };
