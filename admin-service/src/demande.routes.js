const express = require('express');
const router = express.Router();
const Demande = require('./demande.model');
const Message = require('./message.model');

// Créer une demande
router.post('/', async (req, res) => {
  try {
    const { userId, type, rendezVous, documents, notes } = req.body;
    const demande = new Demande({ userId, type, rendezVous, documents, notes });
    await demande.save();
    res.json({ message: 'Demande créée', demande });
  } catch (err) {
    res.status(400).json({ message: 'Erreur création', error: err.message });
  }
});

// Lister toutes les demandes
router.get('/', async (req, res) => {
  const demandes = await Demande.find();
  res.json(demandes);
});

// Changer le statut d'une demande
router.post('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });
    demande.status = status;
    demande.notes = notes;
    await demande.save();
    res.json({ message: 'Statut mis à jour', demande });
  } catch (err) {
    res.status(400).json({ message: 'Erreur statut', error: err.message });
  }
});

// Envoyer un message (admin -> user ou admin -> admin)
router.post('/messages', async (req, res) => {
  try {
    const { from, to, content } = req.body;
    if (!from || !to || !content) return res.status(400).json({ message: 'Champs manquants' });
    const message = new Message({ from, to, content });
    await message.save();
    res.json({ message: 'Message envoyé', data: message });
  } catch (err) {
    res.status(400).json({ message: 'Erreur envoi message', error: err.message });
  }
});

// Lister les messages reçus par un utilisateur
router.get('/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.userId }).sort({ sentAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération messages', error: err.message });
  }
});

module.exports = router;
