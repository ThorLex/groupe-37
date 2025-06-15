const express = require('express');
const router = express.Router();
const Demande = require('./demande.model');

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

module.exports = router;
