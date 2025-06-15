const mongoose = require('mongoose');
const demandeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['INITIALE', 'EN_ATTENTE', 'VALIDEE', 'REFUSEE'], default: 'INITIALE' },
  rendezVous: { type: Date },
  documents: [{ type: mongoose.Schema.Types.ObjectId }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Demande', demandeSchema);
