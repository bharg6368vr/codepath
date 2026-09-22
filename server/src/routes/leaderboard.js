const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/analyticsService');
const { requireAuth } = require('../middleware/auth');

// Get global leaderboard
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = AnalyticsService.calculateLeaderboard 
      ? AnalyticsService.calculateLeaderboard(limit) 
      : [];
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user's rank and nearby competitors
router.get('/me', requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const leaderboard = AnalyticsService.calculateLeaderboard 
      ? AnalyticsService.calculateLeaderboard(1000) 
      : [];

    const userEntry = leaderboard.find(entry => entry.userId === userId);

    if (!userEntry) {
      return res.json({ rank: '-', entry: null, nearby: [] });
    }

    const nearbyIndex = leaderboard.findIndex(entry => entry.userId === userId);
    const nearby = leaderboard.slice(
      Math.max(0, nearbyIndex - 2),
      Math.min(leaderboard.length, nearbyIndex + 3)
    );

    res.json({
      rank: userEntry.rank,
      entry: userEntry,
      nearby
    });
  } catch (error) {
    console.error('User rank error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's struggling concepts
router.get('/me/struggling-concepts', requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const concepts = AnalyticsService.getConceptStruggle 
      ? AnalyticsService.getConceptStruggle(userId) 
      : [];

    res.json(Array.isArray(concepts) ? concepts.slice(0, 5) : []);
  } catch (error) {
    console.error('Struggling concepts error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;