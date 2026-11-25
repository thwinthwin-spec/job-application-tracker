// Small helpers so every route sends the same response shape.

function success(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data
  });
}

function list(res, data) {
  return res.status(200).json({
    success: true,
    data: data
  });
}

function error(res, statusCode, message, errors) {
  const body = {
    success: false,
    message: message
  };

  if (errors) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
}

module.exports = { success, list, error };
