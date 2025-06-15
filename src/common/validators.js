const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage('Mot de passe trop faible'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];
