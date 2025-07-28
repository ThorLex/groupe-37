const express = require('express');
const router = express.Router();
const Demande = require('./demande.model');
const Message = require('./message.model');
const auth = require('./auth');
const { sendEmail } = require('../../payment-notification-service/src/email.service'); // Import du service d'email
const User = require('../../user-service/src/user.model'); // Pour récupérer l'email de l'utilisateur

// Middleware pour la clé API interne
const internalApiKeyAuth = (req, res, next) => {
  const internalApiKey = req.headers['x-internal-api-key'];
  if (internalApiKey && internalApiKey === process.env.INTERNAL_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Clé API interne non autorisée' });
  }
};

// Créer une demande (route interne, appelée par user-service)
/**
 * @swagger
 * /internal/demandes:
 *   post:
 *     summary: Create a new demand (internal use only)
 *     tags: [Demands]
 *     security:
 *       - internalApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *               rendezVous:
 *                 type: string
 *                 format: date-time
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Demand created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/internal/demandes', internalApiKeyAuth, async (req, res) => {
  try {
    const { userId, type, rendezVous, documents, notes } = req.body;
    const demande = new Demande({ userId, type, rendezVous, documents, notes });
    await demande.save();

    // Logique de fallback si aucun agent n'est disponible
    // Dans un cas réel, vous auriez une logique pour vérifier la disponibilité des agents
    // Pour cet exemple, nous allons simplement envoyer un email de notification à un support
    const agentsAvailable = false; // Simule la non-disponibilité d'agents
    if (!agentsAvailable) {
      sendEmail(
        process.env.SUPPORT_EMAIL || 'support@example.com',
        `Nouvelle demande en attente - ${demande._id}`,
        'new_demande_notification', // Un nouveau template pour cette notification
        {
          demandeId: demande._id,
          userId: demande.userId,
          demandeType: demande.type,
          notes: demande.notes || ''
        }
      );
    }

    res.json({ message: 'Demande créée', demande });
  } catch (err) {
    res.status(400).json({ message: 'Erreur création', error: err.message });
  }
});

// Lister toutes les demandes (accessible par agent, admin, superadmin)
/**
 * @swagger
 * /:
 *   get:
 *     summary: List all demands with optional filters
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['INITIALE', 'EN_ATTENTE', 'VALIDEE', 'REFUSEE']
 *         description: Filter demands by status
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: string
 *         description: Filter demands by agent ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter demands created after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter demands created before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: A list of demands
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', auth(['agent', 'admin', 'superadmin']), async (req, res) => {
  try {
    const { status, agentId, startDate, endDate } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (agentId) {
      filter.agentId = agentId;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const demandes = await Demande.find(filter);
    res.json(demandes);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération demandes', error: err.message });
  }
});

// Consulter une demande spécifique (accessible par agent, admin, superadmin)
/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a specific demand by ID
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Demand details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Demand not found
 */
router.get('/:id', auth(['agent', 'admin', 'superadmin']), async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });
    res.json(demande);
  } catch (err) {
    res.status(400).json({ message: 'Erreur récupération demande', error: err.message });
  }
});

// Changer le statut d'une demande (accessible par agent, admin, superadmin)
/**
 * @swagger
 * /{id}/status:
 *   post:
 *     summary: Change the status of a demand
 *     tags: [Demands]
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
 *                 enum: ['VALIDEE', 'REFUSEE']
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Demand status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Demand not found
 */
router.post('/:id/status', auth(['agent', 'admin', 'superadmin']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

    demande.status = status;
    demande.adminNotes = notes;
    demande.agentId = req.user.userId; // L'ID de l'agent qui traite la demande

    if (status === 'VALIDEE') {
      demande.validatedAt = new Date();
      demande.refusedAt = undefined; // S'assurer que refusedAt est vide si validée
    } else if (status === 'REFUSEE') {
      demande.refusedAt = new Date();
      demande.validatedAt = undefined; // S'assurer que validatedAt est vide si refusée
    }

    await demande.save();

    // Envoyer un email à l'utilisateur
    const user = await User.findById(demande.userId);
    if (user && user.email) {
      sendEmail(
        user.email,
        `Mise à jour du statut de votre demande - ${status}`,
        'demande_status',
        {
          userName: user.profile && user.profile.prenom ? user.profile.prenom : user.email,
          demandeType: demande.type,
          newStatus: status,
          notes: notes || ''
        }
      );
    }

    res.json({ message: 'Statut mis à jour', demande });
  } catch (err) {
    res.status(400).json({ message: 'Erreur statut', error: err.message });
  }
});

module.exports = router;