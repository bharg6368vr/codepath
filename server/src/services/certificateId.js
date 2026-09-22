const { v4: uuidv4 } = require('uuid');

const LANGUAGE_CODES = { python: 'PY', java: 'JV', cpp: 'CPP', c: 'C' };

// A bare UUID isn't a meaningful certificate number — this builds a longer,
// self-describing ID (platform + language + year + unique suffix) that
// still embeds a UUID for guaranteed uniqueness, e.g.
// CODEPATH-PY-2026-53F01459-3F37-4418-954C-8E32949EB3AA
function generateCertificateId(languageId) {
  const langCode = LANGUAGE_CODES[languageId] || languageId.toUpperCase();
  const year = new Date().getFullYear();
  const unique = uuidv4().toUpperCase();
  return `CODEPATH-${langCode}-${year}-${unique}`;
}

module.exports = { generateCertificateId };
