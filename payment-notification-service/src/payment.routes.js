const express = require("express");
const router = express.Router();
const Payment = require("./payment.model");
const client = require("./twilio");
const { momoCollection, getAccessToken } = require("./momo");

// Initier un paiement (mock)
router.post("/initiate", async (req, res) => {
  try {
    const { userId, amount, provider } = req.body;
    const payment = new Payment({
      userId,
      amount,
      phoneNumber,
      provider,
      status: "pending",
    });
    await payment.save();

    // Envoyer un SMS
    client.messages
      .create({
        body: `Votre paiement de ${amount} a été initié.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.error(err));

    res.json({ message: "Paiement initié", payment });
  } catch (err) {
    res.status(400).json({ message: "Erreur paiement", error: err.message });
  }
});

// Payer avec Momo
router.post("/momo-pay", async (req, res) => {
  try {
    const { amount, currency, externalId, payer, payerMessage, payeeNote } =
      req.body;
    const accessToken = await getAccessToken();
    const response = await momoCollection.requestToPay(
      {
        amount,
        currency,
        externalId,
        payer,
        payerMessage,
        payeeNote,
      },
      accessToken
    ); // Passer le token d'accès
    res.json({ message: "Paiement Momo initié", data: response });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur paiement Momo", error: err.message });
  }
});

// Callback Momo pour les notifications de paiement
router.post("/momo-callback", async (req, res) => {
  try {
    const { status, externalId, financialTransactionId } = req.body;
    console.log(
      `Momo Callback received: Status - ${status}, External ID - ${externalId}`
    );

    // Mettre à jour le statut du paiement dans votre base de données
    // Vous devrez probablement lier externalId à un paiement existant
    // Exemple: const payment = await Payment.findOneAndUpdate({ externalId }, { status });

    res.status(200).send("Callback received");
  } catch (err) {
    console.error("Error processing Momo callback:", err);
    res
      .status(500)
      .json({ message: "Erreur traitement callback Momo", error: err.message });
  }
});

module.exports = router;
