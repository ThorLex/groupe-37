const Notification = require('./model');

exports.send = async (req, res, next) => {
  try {
    const { type, to, message } = req.body;
    const notif = new Notification({ userId: req.user.userId, type, to, message });
    await notif.save();
    res.json({ message: 'Notification enregistrée', notif });
  } catch (err) {
    next(err);
  }
};
