const express = require('express');
const router = express.Router();
const Payment = require('./payment.model');

// Initier un paiement (mock)
router.post('/initiate', async (req, res) => {
  try {
    const { userId, amount, provider } = req.body;
    const payment = new Payment({ userId, amount, provider, status: 'pending' });
    await payment.save();
    res.json({ message: 'Paiement initié', payment });
  } catch (err) {
    res.status(400).json({ message: 'Erreur paiement', error: err.message });
  }
});

module.exports = router;
