const Demande = require('./model');

exports.create = async (req, res, next) => {
  try {
    const { type, rendezVous, documents, notes } = req.body;
    const demande = new Demande({
      userId: req.user.userId,
      type,
      rendezVous,
      documents,
      notes
    });
    await demande.save();
    res.json({ message: 'Demande créée', demande });
  } catch (err) {
    next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const demandes = await Demande.find({ userId: req.user.userId });
    res.json(demandes);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });
    demande.status = status;
    demande.notes = notes;
    await demande.save();
    res.json({ message: 'Statut mis à jour', demande });
  } catch (err) {
    next(err);
  }
};
