import { handleErrorClient } from "../handlers/response.handlers.js"; // Ajusta el nombre si tu archivo es responsehandlers.js

export const isAdmin = (allowedRoles) => {
  return (req, res, next) => {
    // 1. Verificamos que authMiddleware haya hecho su trabajo
    if (!req.user || !req.user.rol) {
      return handleErrorClient(res, 403, "Acceso denegado. No se pudo determinar el rol.");
    }

    // 2. Verificamos si el rol del usuario está en la lista permitida
    if (allowedRoles.includes(req.user.rol)) {
      next(); // Pasa, tiene permiso
    } else {
      return handleErrorClient(res, 403, `Acceso denegado. Se requiere ser: ${allowedRoles.join(" o ")}.`);
    }
  };
};