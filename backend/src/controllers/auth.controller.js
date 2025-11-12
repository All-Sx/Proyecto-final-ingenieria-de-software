
const { ok, created, badRequest, unauthorized, notFound, fail } =
  require('../handlers/responsehandlers');

const authService = require('../services/auth.service'); 
const userService = require('../services/user.service'); 


exports.register = async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password) return badRequest(res, 'email y password son requeridos');

 
    const user = await userService.createUser({ email, password, nombre, rol });
 
    delete user?.password;

    return created(res, user);
  } catch (err) {
    
    if (err.code === 'ER_DUP_ENTRY' || String(err.message).includes('unique'))
      return badRequest(res, 'El email ya está registrado');
    return fail(res, err);
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return badRequest(res, 'email y password son requeridos');

    const data = await authService.login(email, password); 
    return ok(res, data);
  } catch (err) {
    return unauthorized(res, err.message || 'Credenciales inválidas');
  }
};


exports.listUsers = async (_req, res) => {
  try {
    const users = await userService.listUsers();
 
    const safe = users.map(u => ({ ...u, password: undefined }));
    return ok(res, safe);
  } catch (err) {
    return fail(res, err);
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return notFound(res, 'Usuario no encontrado');
    user.password = undefined;
    return ok(res, user);
  } catch (err) {
    return fail(res, err);
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) return notFound(res, 'Usuario no encontrado');
    updated.password = undefined;
    return ok(res, updated);
  } catch (err) {
   
    if (String(err.message).includes('unique')) return badRequest(res, 'Email ya en uso');
    return fail(res, err);
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const removed = await userService.deleteUser(req.params.id);
    if (!removed) return notFound(res, 'Usuario no encontrado');
    return ok(res, { deleted: true });
  } catch (err) {
    return fail(res, err);
  }
};
