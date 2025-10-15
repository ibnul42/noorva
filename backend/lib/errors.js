const defaultMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Validation Error',
  500: 'Internal Server Error'
};

function Error(res, status = 500, message = null, details = null) {
  const msg = message || defaultMessages[status] || 'Error';
  const payload = { error: msg };
  if (typeof details !== 'undefined' && details !== null) payload.details = details;
  return res.status(status).json(payload);
}

// alias for backwards compatibility
const respond = Error;

function handleError(res, err) {
  console.error(err);
  return Error(res, 500, 'Internal error');
}

// Backwards-compatible wrappers
function badRequest(res, message = null, details = null) { return Error(res, 400, message, details); }
function unauthorized(res, message = null, details = null) { return Error(res, 401, message, details); }
function forbidden(res, message = null, details = null) { return Error(res, 403, message, details); }
function notFound(res, message = null, details = null) { return Error(res, 404, message, details); }
function conflict(res, message = null, details = null) { return Error(res, 409, message, details); }
function internalServerError(res, message = null, details = null) { return Error(res, 500, message, details); }
function validationError(res, details) { return Error(res, 422, null, details); }

module.exports = {
  Error,
  respond,
  handleError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internalServerError,
  validationError
};
