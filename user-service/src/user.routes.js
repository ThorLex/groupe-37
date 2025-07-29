const express = require("express");
const router = express.Router();
const User = require("./user.model");
const Message = require("./message.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const auth = require("./auth");
const axios = require("axios");

// Inscription
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, role });
    await user.save();
    res.json({ message: "Utilisateur enregistré" });
  } catch (err) {
    res.status(400).json({ message: "Erreur inscription", error: err.message });
  }
});

// Connexion
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Mot de passe incorrect" });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erreur login", error: err.message });
  }
});

// Mettre à jour le profil utilisateur
/**
 * @swagger
 * /me:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: object
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/me", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Non authentifié" });
    const user = await User.findByIdAndUpdate(
      userId,
      { profile: req.body.profile },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur update profil", error: err.message });
  }
});

// Ajouter une demande (référence dans user)
/**
 * @swagger
 * /me/demandes:
 *   post:
 *     summary: Add a new demande
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Demande created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/me/demandes", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Non authentifié" });
    // Appel au service admin-service pour créer la demande
    const response = await axios.post(
      process.env.ADMIN_SERVICE_URL ||
        "http://localhost:4002/internal/demandes",
      {
        userId,
        ...req.body,
      },
      {
        headers: {
          "x-internal-api-key": process.env.ADMIN_SERVICE_INTERNAL_API_KEY,
        },
      }
    );
    const demandeId = response.data.demande._id;
    await User.findByIdAndUpdate(userId, { $push: { demandes: demandeId } });
    res.json({ message: "Demande créée", demandeId });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur création demande", error: err.message });
  }
});

// Mettre à jour le statut d'une demande (appelé par admin-service via callback ou API interne)
/**
 * @swagger
 * /me/demandes/{id}/status:
 *   put:
 *     summary: Update a demande status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               motifRefus:
 *                 type: string
 *               commentairesAdmin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Demande status updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/me/demandes/:id/status", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { status, motifRefus, commentairesAdmin } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: userId, "demandes.demandeId": req.params.id },
      {
        $set: {
          "demandes.$.status": status,
          "demandes.$.motifRefus": motifRefus,
          "demandes.$.commentairesAdmin": commentairesAdmin,
          "demandes.$.lastUpdate": new Date(),
        },
      },
      { new: true }
    );
    res.json({ message: "Statut mis à jour", demandes: user.demandes });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur update statut", error: err.message });
  }
});

// Récupérer le statut de toutes les demandes de l'utilisateur
/**
 * @swagger
 * /me/demandes:
 *   get:
 *     summary: Get all demandes for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of demandes
 *       401:
 *         description: Unauthorized
 */
router.get("/me/demandes", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Non authentifié" });
    const user = await User.findById(userId);
    res.json(user.demandes);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur liste demandes", error: err.message });
  }
});

// Ajouter une pièce jointe
/**
 * @swagger
 * /me/documents:
 *   post:
 *     summary: Add a document
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document added successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/me/documents", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Non authentifié" });
    const { fileId, type } = req.body;
    await User.findByIdAndUpdate(userId, {
      $push: { documents: { fileId, type } },
    });
    res.json({ message: "Document ajouté" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur ajout document", error: err.message });
  }
});

// Envoyer un message (user -> admin ou user -> user)
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
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
 */
router.post("/messages", async (req, res) => {
  try {
    const { from, to, content } = req.body;
    if (!from || !to || !content)
      return res.status(400).json({ message: "Champs manquants" });
    const message = new Message({ from, to, content });
    await message.save();
    res.json({ message: "Message envoyé", data: message });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur envoi message", error: err.message });
  }
});

// Lister les messages reçus par un utilisateur
/**
 * @swagger
 * /messages/{userId}:
 *   get:
 *     summary: Get all messages for a user
 *     tags: [Messages]
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
 */
router.get("/messages/:userId", async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.userId }).sort({
      sentAt: -1,
    });
    res.json(messages);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur récupération messages", error: err.message });
  }
});

module.exports = router;
