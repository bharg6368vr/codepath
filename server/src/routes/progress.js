const express = require('express');
const { collection } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const AnalyticsService = require('../services/analyticsService');

const router = express.Router();
const progress = collection('progress');
const modules = collection('modules');

router.use(requireAuth);

function getOrCreate(userId, languageId) {
  let rec = progress.find((p) => p.userId === userId && p.languageId === languageId);
  if (!rec) {
    rec = { userId, languageId, completedModuleIds: [], status: 'in_progress', isEnrolled: true, createdAt: new Date().toISOString() };
    progress.insert(rec);
  }
  return rec;
}

router.get('/:languageId', (req, res) => {
  const rec = getOrCreate(req.user.id, req.params.languageId);
  res.json(rec);
});

router.post('/:languageId/complete-module/:moduleId', (req, res) => {
  const { languageId, moduleId } = req.params;
  const mod = modules.find((m) => m.id === moduleId && m.languageId === languageId);
  if (!mod) return res.status(404).json({ error: 'Module not found' });

  const rec = getOrCreate(req.user.id, languageId);
  const completedModuleIds = rec.completedModuleIds.includes(moduleId)
    ? rec.completedModuleIds
    : [...rec.completedModuleIds, moduleId];

  const totalModules = modules.filter((m) => m.languageId === languageId).length;
  const status = completedModuleIds.length >= totalModules ? 'ready_for_quiz' : 'in_progress';

  const updated = progress.update(
    (p) => p.userId === req.user.id && p.languageId === languageId,
    { completedModuleIds, status, isEnrolled: true }
  );

  AnalyticsService.trackActivity(req.user.id, 'module_completed', { languageId, moduleId });

  res.json(updated);
});

module.exports = router;
