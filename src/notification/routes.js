const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../common/auth');

// Envoi notification (mock)
router.post('/send', auth, controller.send);

module.exports = router;
