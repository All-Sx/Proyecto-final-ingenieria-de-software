


const send = (res, status, payload) =>
  res.status(status).json(payload);

const baseOk = (data) => ({ ok: true, data });
const baseErr = (message, code) => ({ ok: false, message, code });


exports.ok = (res, data = null) => send(res, 200, baseOk(data));
exports.created = (res, data = null) => send(res, 201, baseOk(data));
exports.noContent = (res) => res.status(204).end();


exports.badRequest = (res, message = 'Solicitud inválida') =>
  send(res, 400, baseErr(message, 'BAD_REQUEST'));

exports.unauthorized = (res, message = 'No autorizado') =>
  send(res, 401, baseErr(message, 'UNAUTHORIZED'));

exports.forbidden = (res, message = 'Prohibido') =>
  send(res, 403, baseErr(message, 'FORBIDDEN'));

exports.notFound = (res, message = 'No encontrado') =>
  send(res, 404, baseErr(message, 'NOT_FOUND'));

exports.conflict = (res, message = 'Conflicto') =>
  send(res, 409, baseErr(message, 'CONFLICT'));

exports.fail = (res, err, message = 'Error interno del servidor') => {

  console.error('[FAIL]', err?.stack || err?.message || err);
  return send(res, 500, baseErr(message, 'INTERNAL_ERROR'));
};


exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


exports.mapServiceError = (res, err) => {
  const msg = String(err?.message || '');
  const code = String(err?.code || '');

 
  if (code === 'ER_DUP_ENTRY' || code === '23505' || /unique/i.test(msg))
    return exports.conflict(res, 'Recurso ya existe (violación de único)');

  
  if (/not\s?found|no encontrado/i.test(msg))
    return exports.notFound(res, 'Recurso no encontrado');

  
  if (/invalid|inválid|validation/i.test(msg))
    return exports.badRequest(res, msg);


  return exports.fail(res, err);
};


exports.errorMiddleware = (err, _req, res, _next) => {
 
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || 'Error interno del servidor';


  if (err.code === 'ER_DUP_ENTRY' || err.code === '23505' || /unique/i.test(message)) {
    return exports.conflict(res, 'Recurso ya existe (violación de único)');
  }

  if (status >= 400 && status < 500) {
    return send(res, status, baseErr(message, 'CLIENT_ERROR'));
  }

  console.error('[ERROR MW]', err?.stack || err);
  return send(res, 500, baseErr('Error interno del servidor', 'INTERNAL_ERROR'));
};

