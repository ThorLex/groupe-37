const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../common/auth');

// Initier un paiement (mock)
router.post('/initiate', auth, controller.initiate);
// Lister les paiements de l'utilisateur
router.get('/me', auth, controller.listMine);

module.exports = router;
