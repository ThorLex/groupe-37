const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = authMiddleware;
