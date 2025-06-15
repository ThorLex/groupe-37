const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../common/auth');
const roleGuard = require('../common/roleGuard');

// Création de demande
router.post('/', auth, controller.create);
// Lister les demandes de l'utilisateur connecté
router.get('/me', auth, controller.listMine);
// Changer le statut d'une demande (agent/admin)
router.post('/:id/status', auth, roleGuard(['agent', 'admin']), controller.updateStatus);

module.exports = router;
