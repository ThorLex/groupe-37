const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'agent', 'admin'], default: 'citizen' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.path('password').validate(function(value) {
  // Mot de passe fort : min 8 caractères, majuscule, minuscule, chiffre
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
}, 'Mot de passe trop faible');

module.exports = mongoose.model('User', userSchema);
