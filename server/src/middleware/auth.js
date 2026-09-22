const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.warn(
    '[auth] JWT_SECRET is not set — using an insecure default. ' +
    'Set JWT_SECRET in server/.env before deploying anywhere but your own machine.'
  );
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Support all import patterns across all routes
module.exports = requireAuth;
module.exports.requireAuth = requireAuth;
module.exports.authMiddleware = requireAuth;
module.exports.JWT_SECRET = JWT_SECRET;