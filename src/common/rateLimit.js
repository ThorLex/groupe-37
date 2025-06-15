// Middleware de rate limiting
const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: { message: 'Trop de requêtes, réessayez plus tard.' }
});
