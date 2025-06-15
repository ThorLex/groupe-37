const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', auditSchema);
