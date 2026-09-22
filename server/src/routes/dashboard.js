const express = require('express');
const router = express.Router();
const { collection } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const AnalyticsService = require('../services/analyticsService');

// Get user's complete dashboard stats
router.get('/me', requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    // Fetch user-specific records
    const userProgress = collection('progress').filter(p => p.userId === userId);
    const quizAttempts = collection('quizAttempts').filter(q => q.userId === userId);
    const certificates = collection('certificates').filter(c => c.userId === userId);
    const allLanguages = collection('languages').all();
    const allModules = collection('modules').all();

    // Map all languages to their progress state for this user
    const progressByLanguage = allLanguages.map(lang => {
      const p = userProgress.find(pr => pr.languageId === lang.id) || {};
      const completedIds = p.completedModuleIds || [];
      const totalModulesForLang = allModules.filter(m => m.languageId === lang.id).length;

      const hasCert = certificates.some(c => c.languageId === lang.id);
      const hasPassedQuiz = quizAttempts.some(q => q.languageId === lang.id && q.passed);
      const isCompleted = totalModulesForLang > 0 && completedIds.length >= totalModulesForLang;
      const isEnrolled = Boolean(p.isEnrolled || completedIds.length > 0 || hasPassedQuiz || hasCert);

      let status = 'not_started';
      if (hasCert || hasPassedQuiz) {
        status = 'passed';
      } else if (isCompleted) {
        status = 'ready_for_quiz';
      } else if (isEnrolled) {
        status = 'in_progress';
      }

      return {
        languageId: lang.id,
        languageName: lang.name || lang.id,
        description: lang.description || '',
        completedModules: completedIds.length,
        totalModules: totalModulesForLang,
        status: status
      };
    });

    // Active learning tracks for "Your Languages"
    const activeLanguages = progressByLanguage.filter(
      p => p.status === 'in_progress' || p.status === 'ready_for_quiz' || p.status === 'passed' || p.completedModules > 0
    );

    const scoredQuizzes = quizAttempts.filter(q => q.score !== null && q.score !== undefined);
    const averageScore = scoredQuizzes.length > 0
      ? Math.round(scoredQuizzes.reduce((sum, q) => sum + q.score, 0) / scoredQuizzes.length)
      : 0;

    const stats = {
      languagesLearning: activeLanguages.length,
      completedModules: userProgress.reduce((sum, p) => sum + (p.completedModuleIds?.length || 0), 0),
      totalModules: allModules.length,
      quizzesTaken: quizAttempts.length,
      averageScore,
      certificatesEarned: certificates.length,
      certificates: certificates,
      streak: AnalyticsService.calculateStreak ? AnalyticsService.calculateStreak(userId) : 1,
      lastActive: AnalyticsService.getLastActive ? AnalyticsService.getLastActive(userId) : new Date().toISOString(),
      progressByLanguage,
      activeLanguages,
      languages: allLanguages
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to handle track enrollment directly from Dashboard
router.post('/enroll/:languageId', requireAuth, (req, res) => {
  try {
    const { languageId } = req.params;
    const userId = req.user?.id;

    const existing = collection('progress').find(p => p.userId === userId && p.languageId === languageId);

    let updatedProgress;
    if (!existing) {
      updatedProgress = collection('progress').insert({
        id: `prog_${Date.now()}`,
        userId,
        languageId,
        isEnrolled: true,
        completedModuleIds: [],
        status: 'in_progress',
        createdAt: new Date().toISOString()
      });
    } else {
      updatedProgress = collection('progress').update(
        p => p.userId === userId && p.languageId === languageId,
        { isEnrolled: true }
      );
    }

    AnalyticsService.trackActivity(userId, 'track_enrolled', { languageId });

    res.json({ message: 'Enrolled successfully', progress: updatedProgress });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to handle checking/unchecking module completion
router.post('/modules/:moduleId/toggle', requireAuth, (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.id;

    const moduleDoc = collection('modules').find(m => m.id === moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ error: 'Module not found' });
    }

    let userProgress = collection('progress').find(
      p => p.userId === userId && p.languageId === moduleDoc.languageId
    );

    if (!userProgress) {
      userProgress = collection('progress').insert({
        id: `prog_${Date.now()}`,
        userId,
        languageId: moduleDoc.languageId,
        isEnrolled: true,
        completedModuleIds: [],
        status: 'in_progress',
        createdAt: new Date().toISOString()
      });
    }

    const currentCompleted = userProgress.completedModuleIds || [];
    const isAdding = !currentCompleted.includes(moduleId);
    const newCompleted = isAdding
      ? [...currentCompleted, moduleId]
      : currentCompleted.filter(id => id !== moduleId);

    const totalModules = collection('modules').filter(m => m.languageId === moduleDoc.languageId).length;
    const status = newCompleted.length >= totalModules ? 'ready_for_quiz' : 'in_progress';

    const updated = collection('progress').update(
      p => p.userId === userId && p.languageId === moduleDoc.languageId,
      { completedModuleIds: newCompleted, isEnrolled: true, status }
    );

    AnalyticsService.trackActivity(userId, isAdding ? 'module_completed' : 'module_uncompleted', {
      moduleId,
      languageId: moduleDoc.languageId
    });

    res.json({ message: 'Module progress updated', completedModuleIds: updated.completedModuleIds });
  } catch (err) {
    console.error('Module toggle error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get detailed progress & modules list for a specific language
router.get('/language/:languageId', requireAuth, (req, res) => {
  try {
    const { languageId } = req.params;
    const userId = req.user?.id;

    const progress = collection('progress').find(p => p.userId === userId && p.languageId === languageId);
    const language = collection('languages').find(l => l.id === languageId);
    const modules = collection('modules')
      .filter(m => m.languageId === languageId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const detailedModules = modules.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      order: m.order,
      duration: m.duration,
      isCompleted: progress?.completedModuleIds?.includes(m.id) || false
    }));

    res.json({
      languageId,
      languageName: language?.name || languageId,
      completedCount: progress?.completedModuleIds?.length || 0,
      totalModules: modules.length,
      modules: detailedModules
    });
  } catch (error) {
    console.error('Language detail error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;