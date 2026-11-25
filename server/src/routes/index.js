const router = require('express').Router();
const authRoutes = require('./auth.routes');
const applicationRoutes = require('./application.routes');

// All API paths live under /api (mounted in app.js).
router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;
