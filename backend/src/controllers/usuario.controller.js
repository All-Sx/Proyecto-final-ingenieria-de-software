import { createUserWithRoleService, getAlumnosService, getProfesoresService, getUserByIdService, updateClaveService, updateUserService } from "../services/usuario.service.js";
import { handleErrorClient, handleSuccess } from "../handlers/response.handlers.js";
import { cambiarClaveValidation } from "../validators/cambio_clave.validation.js";

export const createUserAdmin = async (req, res) => {
  try {
    const { rut, nombre_completo, email, password, rol } = req.body;


    if (!rut || !nombre_completo || !email || !password || !rol) {
      return handleErrorClient(res, 400, "Faltan datos obligatorios.");
    }


    const rolesPermitidos = ["Alumno", "Profesor"];

    if (!rolesPermitidos.includes(rol)) {
      return handleErrorClient(res, 400, "Rol no válido. Solo puedes crear: 'Alumno' o 'Profesor'. Para crear Jefes de Carrera usa el endpoint /api/jefe-carrera");
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

export const getMyProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await getUserByIdService(id);

    if (result.error) {
      return handleErrorClient(res, 404, result.error);
    }

    return res.status(200).json({
      message: "Perfil de usuario",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { nombre_completo, email } = req.body;

    const result = await updateUserService(id, { nombre_completo, email });

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    return res.status(200).json({
      message: "Datos actualizados correctamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};
export const updateClave = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword, passwordVerification } = req.body;

    const { error } = cambiarClaveValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const result = await updateClaveService(id, { password, newPassword, passwordVerification })

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }
    return res.status(200).json({
      message: "Clave actualizada correctamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
}