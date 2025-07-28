const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token manquant' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      req.user = payload; // { userId, role }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token invalide' });
    }
  };
};