const express = require('express');
const router = express.Router();
const auth = require('./auth');
const User = require('../../user-service/src/user.model'); // Accès au modèle User
const Demande = require('./demande.model');
const Payment = require('../../payment-notification-service/src/payment.model');
const Message = require('./message.model');

// Route pour lister les utilisateurs et modifier leurs rôles (Admin et SuperAdmin)
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération utilisateurs', error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: role
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: ['user', 'agent', 'admin', 'superadmin']
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put('/users/:id/role', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Rôle utilisateur mis à jour', user });
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour rôle', error: err.message });
  }
});

// Routes pour les statistiques globales (Admin et SuperAdmin)
/**
 * @swagger
 * /stats/demands:
 *   get:
 *     summary: Get demand statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demand statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats/demands', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const stats = await Demande.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération statistiques demandes', error: err.message });
  }
});

/**
 * @swagger
 * /stats/payments:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats/payments', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      { $group: { _id: '$status', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération statistiques paiements', error: err.message });
  }
});

// Envoyer un message (admin -> user ou admin -> admin) (accessible par agent, admin, superadmin)
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message (admin to user or admin to admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/messages', auth(['agent', 'admin', 'superadmin']), async (req, res) => {
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

// Lister les messages reçus par un utilisateur (accessible par agent, admin, superadmin)
/**
 * @swagger
 * /messages/{userId}:
 *   get:
 *     summary: List messages received by a user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of messages
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/messages/:userId', auth(['agent', 'admin', 'superadmin']), async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.userId }).sort({ sentAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération messages', error: err.message });
  }
});

module.exports = router;