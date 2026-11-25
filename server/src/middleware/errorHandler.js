const apiResponse = require('../utils/apiResponse');

// One place that turns thrown errors into the standard error response.
function errorHandler(error, req, res, next) {
  console.error('Request error:', error.message);

  if (error.name === 'CastError') {
    return apiResponse.error(res, 400, 'Invalid id or date format.');
  }

  if (error.name === 'ValidationError') {
    const messages = [];
    const keys = Object.keys(error.errors);

    for (let i = 0; i < keys.length; i += 1) {
      messages.push(error.errors[keys[i]].message);
    }

    return apiResponse.error(res, 400, 'Validation failed.', messages);
  }

  if (error.code === 11000) {
    return apiResponse.error(res, 409, 'That email address is already in use.');
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return apiResponse.error(res, 401, 'Invalid or expired token.');
  }

  return apiResponse.error(res, 500, 'Something went wrong. Please try again later.');
}

module.exports = errorHandler;
