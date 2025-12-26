import { createUserWithRoleService } from "../services/usuario.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createUserAdmin = async (req, res) => {
  try {
    const { rut, nombre_completo, email, password, rol } = req.body;

    // 1. Validaciones básicas
    if (!rut || !nombre_completo || !email || !password || !rol) {
      return handleErrorClient(res, 400, "Faltan datos obligatorios.");
    }

    // 2. SEGURIDAD: Validar que solo cree roles permitidos
    // El Jefe de Carrera no debería poder crear un "SuperAdmin" o roles inventados
    const rolesPermitidos = ["Jefe de Carrera", "Profesor"];
    
    if (!rolesPermitidos.includes(rol)) {
      return handleErrorClient(res, 400, "Rol no válido. Solo puedes crear: 'Jefe de Carrera' o 'Profesor'.");
    }

    // 3. Llamar al servicio
    const result = await createUserWithRoleService({
      rut,
      nombre_completo,
      email,
      password,
      rolNombre: rol
    });

    if (result.error) {
      return handleErrorClient(res, 409, result.error);
    }

    return res.status(201).json({
      message: `Usuario con rol '${rol}' creado exitosamente.`,
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor.", error.message);
  }
};