const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { collection, getStore, updateStore } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const AnalyticsService = require('../services/analyticsService');

// Submit game score and award XP
router.post('/submit-score', requireAuth, (req, res) => {
  try {
    const { gameType, score, xpEarned, languageId } = req.body;
    const userId = req.user?.id;

    if (!userId || !gameType) {
      return res.status(400).json({ error: 'gameType and user authentication required' });
    }

    const store = getStore();
    store.arcadeScores = store.arcadeScores || [];

    const record = {
      id: uuidv4(),
      userId,
      learnerName: req.user.name || 'Player',
      gameType, // 'bug_hunt', 'output_oracle', 'code_assembler'
      score: parseInt(score, 10) || 0,
      xpEarned: parseInt(xpEarned, 10) || 0,
      languageId: languageId || 'all',
      playedAt: new Date().toISOString()
    };

    store.arcadeScores.push(record);
    updateStore(store);

    AnalyticsService.trackActivity(userId, 'arcade_game_played', {
      gameType,
      score: record.score,
      xpEarned: record.xpEarned
    });

    // Calculate user total XP
    const userRecords = store.arcadeScores.filter(s => s.userId === userId);
    const totalXp = userRecords.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
    const userLevel = Math.floor(totalXp / 250) + 1;

    res.json({
      success: true,
      record,
      totalXp,
      userLevel,
      gamesPlayed: userRecords.length
    });
  } catch (error) {
    console.error('Arcade score error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's arcade stats
router.get('/stats', requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    const store = getStore();
    const scores = (store.arcadeScores || []).filter(s => s.userId === userId);

    const totalXp = scores.reduce((sum, s) => sum + (s.xpEarned || 0), 0);
    const userLevel = Math.floor(totalXp / 250) + 1;

    const bugHuntBest = Math.max(0, ...scores.filter(s => s.gameType === 'bug_hunt').map(s => s.score));
    const outputOracleBest = Math.max(0, ...scores.filter(s => s.gameType === 'output_oracle').map(s => s.score));
    const assemblerBest = Math.max(0, ...scores.filter(s => s.gameType === 'code_assembler').map(s => s.score));

    res.json({
      totalXp,
      userLevel,
      gamesPlayed: scores.length,
      highScores: {
        bugHunt: bugHuntBest,
        outputOracle: outputOracleBest,
        codeAssembler: assemblerBest
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get arcade leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const store = getStore();
    const scores = store.arcadeScores || [];
    const users = store.users || [];

    const userXpMap = {};

    scores.forEach(s => {
      userXpMap[s.userId] = (userXpMap[s.userId] || 0) + (s.xpEarned || 0);
    });

    const leaderboard = Object.entries(userXpMap).map(([uId, xp]) => {
      const user = users.find(u => u.id === uId);
      return {
        userId: uId,
        name: user?.name || 'Gamer',
        totalXp: xp,
        level: Math.floor(xp / 250) + 1,
        gamesPlayed: scores.filter(s => s.userId === uId).length
      };
    })
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, 10)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
