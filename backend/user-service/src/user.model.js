const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: String,
  nationalite: String,
  profession: String
}, { _id: false });

const tuteurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  telephone: String,
  adresse: String
}, { _id: false });

const documentSchema = new mongoose.Schema({
  fileId: String,
  type: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const demandeRefSchema = new mongoose.Schema({
  demandeId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: ['SOUMIS', 'EN_COURS_EXAMEN', 'REJETE', 'ACCEPTE'], default: 'SOUMIS' },
  motifRefus: String,
  commentairesAdmin: String,
  lastUpdate: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'agent', 'admin'], default: 'citizen' },
  profile: {
    nom: String,
    prenom: String,
    dateNaissance: String,
    lieuNaissance: String,
    sexe: String,
    nationalite: String,
    profession: String,
    adresse: String,
    telephone: String,
    parents: {
      pere: parentSchema,
      mere: parentSchema
    },
    tuteur: tuteurSchema
  },
  documents: [documentSchema],
  demandes: [demandeRefSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
