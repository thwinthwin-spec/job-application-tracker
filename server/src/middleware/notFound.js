const apiResponse = require('../utils/apiResponse');

// Last route: nothing else matched, so respond with a JSON 404.
function notFound(req, res) {
  return apiResponse.error(res, 404, 'Route not found.');
}

module.exports = notFound;
