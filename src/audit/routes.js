const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../common/auth');

// Enregistrer un événement d'audit
router.post('/', auth, controller.log);
// Récupérer les logs d'audit (admin seulement)
router.get('/', auth, controller.list);

module.exports = router;
