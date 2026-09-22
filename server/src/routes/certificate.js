const express = require('express');
const { collection } = require('../db/store');
const { requireAuth } = require('../middleware/auth');
const { streamCertificatePdf } = require('../services/certificateService');
const { generateCertificateId } = require('../services/certificateId');
const AnalyticsService = require('../services/analyticsService');

const router = express.Router();
const certificates = collection('certificates');
const quizAttempts = collection('quizAttempts');
const languages = collection('languages');

const PUBLIC_APP_URL = (process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');

function withVerifyUrl(cert) {
  return { ...cert, verifyUrl: `${PUBLIC_APP_URL}/verify/${cert.certificateId}` };
}

router.get('/:languageId/me', requireAuth, (req, res) => {
  const { languageId } = req.params;
  const cert = certificates.find((c) => c.userId === req.user.id && c.languageId === languageId);
  if (!cert) return res.status(404).json({ error: 'No certificate found for this language yet' });
  res.json(withVerifyUrl(cert));
});

router.post('/:languageId/issue', requireAuth, (req, res) => {
  const { languageId } = req.params;
  const lang = languages.find((l) => l.id === languageId);
  if (!lang) return res.status(404).json({ error: 'Unknown language' });

  const passedAttempt = quizAttempts
    .filter((a) => a.userId === req.user.id && a.languageId === languageId && a.passed)
    .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))[0];

  if (!passedAttempt) {
    return res.status(403).json({ error: 'You must pass the quiz for this language before claiming a certificate' });
  }

  // A certificate may already exist from an earlier pass — if the learner has
  // since retaken the quiz, keep the same certificate ID (so old verification
  // links keep working) but refresh the score to their latest result.
  const existing = certificates.find((c) => c.userId === req.user.id && c.languageId === languageId);
  if (existing) {
    if (existing.score === passedAttempt.score) {
      return res.json(withVerifyUrl(existing));
    }
    const updated = certificates.update(
      (c) => c.certificateId === existing.certificateId,
      { score: passedAttempt.score, issuedAt: new Date().toISOString() }
    );
    AnalyticsService.trackActivity(req.user.id, 'certificate_earned', {
      languageId,
      certificateId: existing.certificateId,
      score: passedAttempt.score
    });
    return res.json(withVerifyUrl(updated));
  }

  const cert = {
    certificateId: generateCertificateId(languageId),
    userId: req.user.id,
    languageId,
    learnerName: req.user.name,
    score: passedAttempt.score,
    issuedAt: new Date().toISOString(),
  };
  certificates.insert(cert);

  AnalyticsService.trackActivity(req.user.id, 'certificate_earned', {
    languageId,
    certificateId: cert.certificateId,
    score: passedAttempt.score
  });

  res.status(201).json(withVerifyUrl(cert));
});

// Public: verification metadata (no auth required)
router.get('/:certificateId', (req, res) => {
  const cert = certificates.find((c) => c.certificateId === req.params.certificateId);
  if (!cert) return res.status(404).json({ error: 'Certificate not found' });
  res.json(withVerifyUrl(cert));
});

// Public: PDF download (no auth required, shareable link)
router.get('/:certificateId/download', (req, res) => {
  const cert = certificates.find((c) => c.certificateId === req.params.certificateId);
  if (!cert) return res.status(404).json({ error: 'Certificate not found' });
  streamCertificatePdf(res, cert);
});

module.exports = router;
