const Payment = require('./model');

exports.initiate = async (req, res, next) => {
  try {
    const { amount, provider } = req.body;
    const payment = new Payment({ userId: req.user.userId, amount, provider, status: 'pending' });
    await payment.save();
    res.json({ message: 'Paiement initié', payment });
  } catch (err) {
    next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};
