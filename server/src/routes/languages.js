const express = require('express');
const router = express.Router();
const { collection } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const AnalyticsService = require('../services/analyticsService');

const languages = collection('languages');
const modules = collection('modules');
const progress = collection('progress');

// Get all languages
router.get('/', (req, res) => {
  res.json(languages.all());
});

// Get modules for a specific language
router.get('/:id/modules', (req, res) => {
  const lang = languages.find((l) => l.id === req.params.id);
  if (!lang) return res.status(404).json({ error: 'Unknown language' });
  
  const mods = modules
    .filter((m) => m.languageId === req.params.id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
    
  res.json(mods);
});

// Enroll user in a language track when they click "Start Track"
router.post('/:id/enroll', requireAuth, (req, res) => {
  try {
    const languageId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const lang = languages.find((l) => l.id === languageId);
    if (!lang) {
      return res.status(404).json({ error: 'Language track not found' });
    }

    let userProgress = progress.find(
      (p) => p.userId === userId && p.languageId === languageId
    );

    if (!userProgress) {
      userProgress = progress.insert({
        id: `prog_${Date.now()}`,
        userId,
        languageId,
        isEnrolled: true,
        completedModuleIds: [],
        status: 'in_progress',
        createdAt: new Date().toISOString()
      });
    } else {
      userProgress = progress.update(
        (p) => p.userId === userId && p.languageId === languageId,
        { isEnrolled: true }
      );
    }

    AnalyticsService.trackActivity(userId, 'track_enrolled', { languageId });

    res.json({
      message: `Successfully enrolled in ${lang.name || languageId}`,
      progress: userProgress
    });
  } catch (error) {
    console.error('Error enrolling in track:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;