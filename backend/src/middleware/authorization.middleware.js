import { handleErrorClient } from "../handlers/response.handlers.js"; 

export const isAdmin = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return handleErrorClient(res, 403, "Acceso denegado. No se pudo determinar el rol.");
    }

    if (allowedRoles.includes(req.user.rol)) {
      next(); 
    } else {
      return handleErrorClient(res, 403, `Acceso denegado. Se requiere ser: ${allowedRoles.join(" o ")}.`);
    }
  };
};