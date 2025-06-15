const express = require('express');
const router = express.Router();
const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('./auth');
const axios = require('axios');

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, role });
    await user.save();
    res.json({ message: 'Utilisateur enregistré' });
  } catch (err) {
    res.status(400).json({ message: 'Erreur inscription', error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur login', error: err.message });
  }
});

// Mettre à jour le profil utilisateur
router.put('/me', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    const user = await User.findByIdAndUpdate(userId, { profile: req.body.profile }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erreur update profil', error: err.message });
  }
});

// Ajouter une demande (référence dans user)
router.post('/me/demandes', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    // Appel au service admin-service pour créer la demande
    const response = await axios.post(process.env.ADMIN_SERVICE_URL || 'http://localhost:4003/demandes', {
      userId,
      ...req.body
    });
    const demandeId = response.data.demande._id;
    await User.findByIdAndUpdate(userId, { $push: { demandes: demandeId } });
    res.json({ message: 'Demande créée', demandeId });
  } catch (err) {
    res.status(400).json({ message: 'Erreur création demande', error: err.message });
  }
});

// Mettre à jour le statut d'une demande (appelé par admin-service via callback ou API interne)
router.put('/me/demandes/:id/status', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { status, motifRefus, commentairesAdmin } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: userId, 'demandes.demandeId': req.params.id },
      {
        $set: {
          'demandes.$.status': status,
          'demandes.$.motifRefus': motifRefus,
          'demandes.$.commentairesAdmin': commentairesAdmin,
          'demandes.$.lastUpdate': new Date()
        }
      },
      { new: true }
    );
    res.json({ message: 'Statut mis à jour', demandes: user.demandes });
  } catch (err) {
    res.status(400).json({ message: 'Erreur update statut', error: err.message });
  }
});

// Récupérer le statut de toutes les demandes de l'utilisateur
router.get('/me/demandes', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    const user = await User.findById(userId);
    res.json(user.demandes);
  } catch (err) {
    res.status(400).json({ message: 'Erreur liste demandes', error: err.message });
  }
});

// Ajouter une pièce jointe
router.post('/me/documents', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });
    const { fileId, type } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { documents: { fileId, type } } });
    res.json({ message: 'Document ajouté' });
  } catch (err) {
    res.status(400).json({ message: 'Erreur ajout document', error: err.message });
  }
});

module.exports = router;
