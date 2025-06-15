// Configuration commune
module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/app',
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
};
