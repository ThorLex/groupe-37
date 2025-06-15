const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { registerValidator, loginValidator } = require('../common/validators');
const { validationResult } = require('express-validator');
const auth = require('../common/auth');

// Inscription utilisateur
router.post('/register', registerValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  controller.register(req, res, next);
});

// Connexion utilisateur
router.post('/login', loginValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  controller.login(req, res, next);
});

router.get('/me', auth, controller.me);

module.exports = router;
