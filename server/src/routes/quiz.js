const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { collection } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const ragClient = require('../services/ragClient');
const AnalyticsService = require('../services/analyticsService');

const router = express.Router();
const quizAttempts = collection('quizAttempts');
const progress = collection('progress');
const languages = collection('languages');

const PASSING_THRESHOLD = parseInt(process.env.QUIZ_PASS_THRESHOLD || '70', 10);

router.use(requireAuth);

router.post('/:languageId/generate', async (req, res) => {
  const { languageId } = req.params;
  const lang = languages.find((l) => l.id === languageId);
  if (!lang) return res.status(404).json({ error: 'Unknown language' });

  try {
    const rawQuestions = await ragClient.generateQuiz(languageId);
    const questions = rawQuestions.map((q) => ({ id: uuidv4(), ...q }));

    const attempt = {
      id: uuidv4(),
      userId: req.user.id,
      languageId,
      questions,
      userAnswers: {},
      score: null,
      passed: null,
      generatedAt: new Date().toISOString(),
      submittedAt: null,
    };
    quizAttempts.insert(attempt);

    res.json({
      attemptId: attempt.id,
      questions: questions.map(({ id, question, type, options }) => ({ id, question, type, options })),
    });
  } catch (err) {
    res.status(502).json({ error: `Could not generate quiz: ${err.message}` });
  }
});

router.post('/:attemptId/submit', async (req, res) => {
  const { attemptId } = req.params;
  const { answers } = req.body || {};
  const attempt = quizAttempts.find((a) => a.id === attemptId && a.userId === req.user.id);
  if (!attempt) return res.status(404).json({ error: 'Quiz attempt not found' });
  if (attempt.submittedAt) return res.status(409).json({ error: 'This quiz attempt was already submitted' });

  const feedback = [];
  let correctCount = 0;

  for (const q of attempt.questions) {
    const userAnswer = (answers && answers[q.id]) || '';
    let correct;
    let explanation = q.explanation;

    if (q.type === 'code_output') {
      try {
        const verdict = await ragClient.evaluateAnswer({
          question: q.question,
          userAnswer,
          correctAnswer: q.correctAnswer,
          questionType: q.type,
        });
        correct = verdict.verdict === 'correct';
        explanation = verdict.feedback || explanation;
      } catch {
        correct = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      }
    } else {
      correct = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    }

    if (correct) correctCount += 1;
    feedback.push({ questionId: q.id, question: q.question, userAnswer, correct, explanation });
  }

  const score = Math.round((correctCount / attempt.questions.length) * 100);
  const passed = score >= PASSING_THRESHOLD;

  quizAttempts.update(
    (a) => a.id === attemptId,
    { userAnswers: answers || {}, score, passed, submittedAt: new Date().toISOString() }
  );

  if (passed) {
    progress.update(
      (p) => p.userId === req.user.id && p.languageId === attempt.languageId,
      { status: 'passed' }
    );
  }

  AnalyticsService.trackActivity(req.user.id, 'quiz_submitted', {
    languageId: attempt.languageId,
    score,
    passed
  });

  res.json({ score, passed, passingThreshold: PASSING_THRESHOLD, feedback });
});

module.exports = router;
