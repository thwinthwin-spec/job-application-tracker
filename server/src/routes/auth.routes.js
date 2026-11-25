const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public routes.
router.post('/register', validate.registerRules, validate.validateRequest, authController.register);
router.post('/login', validate.loginRules, validate.validateRequest, authController.login);

// Private route: /me needs a valid token.
router.get('/me', auth.protect, authController.me);

// The client removes its own token, so logout only needs to reply.
router.post('/logout', authController.logout);

module.exports = router;
