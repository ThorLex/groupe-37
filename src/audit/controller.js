const Audit = require('./model');

exports.log = async (req, res, next) => {
  try {
    const { action, details } = req.body;
    const audit = new Audit({ userId: req.user.userId, action, details });
    await audit.save();
    res.json({ message: 'Audit enregistré', audit });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const logs = await Audit.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
