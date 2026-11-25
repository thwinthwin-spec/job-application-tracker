const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const apiResponse = require('../utils/apiResponse');

// Check for "Authorization: Bearer <token>" and attach the user to req.
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return apiResponse.error(res, 401, 'Please log in to continue.');
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return apiResponse.error(res, 401, 'User no longer exists. Please log in again.');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return apiResponse.error(res, 401, 'Invalid or expired token.');
    }

    return next(error);
  }
}

module.exports = { protect };
