// Middleware de logging simple
module.exports = function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${req.user ? req.user.userId : 'anon'}`);
  next();
};
