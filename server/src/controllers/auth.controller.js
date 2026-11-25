const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const apiResponse = require('../utils/apiResponse');

// Make a signed token for a newly created or logged-in user.
function makeToken(user) {
  return jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return apiResponse.error(res, 400, 'An account with that email already exists.');
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash
    });

    const token = makeToken(user);
    return apiResponse.success(res, 201, 'Account created.', { token: token, user: user });
  } catch (error) {
    return next(error);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user) {
      return apiResponse.error(res, 401, 'Email or password is incorrect.');
    }

    const passwordMatches = await user.comparePassword(req.body.password);

    if (!passwordMatches) {
      return apiResponse.error(res, 401, 'Email or password is incorrect.');
    }

    const token = makeToken(user);
    return apiResponse.success(res, 200, 'Logged in successfully.', { token: token, user: user });
  } catch (error) {
    return next(error);
  }
}

// GET /api/auth/me
function me(req, res) {
  return apiResponse.success(res, 200, 'User profile fetched.', { user: req.user });
}

// POST /api/auth/logout (the client is responsible for deleting its token)
function logout(req, res) {
  return apiResponse.success(res, 200, 'Logged out successfully.', {});
}

module.exports = { register, login, me, logout };
