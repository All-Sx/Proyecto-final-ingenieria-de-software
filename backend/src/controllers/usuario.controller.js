import { createUserWithRoleService, getAlumnosService, getProfesoresService } from "../services/usuario.service.js";
import { handleErrorClient, handleSuccess } from "../handlers/response.handlers.js";

export const createUserAdmin = async (req, res) => {
  try {
    const { rut, nombre_completo, email, password, rol } = req.body;

    
    if (!rut || !nombre_completo || !email || !password || !rol) {
      return handleErrorClient(res, 400, "Faltan datos obligatorios.");
    }

    
    const rolesPermitidos = ["Jefe de Carrera", "Profesor"];
    
    if (!rolesPermitidos.includes(rol)) {
      return handleErrorClient(res, 400, "Rol no válido. Solo puedes crear: 'Jefe de Carrera' o 'Profesor'.");
    }

   
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


export const getAlumnos = async (req, res) => {
  try {
    const result = await getAlumnosService();

    if (result.error) {
      return handleErrorClient(res, 404, result.error);
    }

    return handleSuccess(res, 200, "Lista de alumnos", result.data);

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor.", error.message);
  }
};


export const getProfesores = async (req, res) => {
  try {
    const result = await getProfesoresService();

    if (result.error) {
      return handleErrorClient(res, 404, result.error);
    }

    return handleSuccess(res, 200, "Lista de profesores", result.data);

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor.", error.message);
  }
};