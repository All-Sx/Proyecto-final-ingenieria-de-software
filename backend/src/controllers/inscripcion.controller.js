import { createSolicitudService, getSolicitudesPorAlumnoService, getCuposPorCarreraService } from "../services/inscripcion.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createSolicitud = async (req, res) => {
  try {
    // 1. Obtener ID del Alumno desde el Token (inyectado por authMiddleware)
    const { id: alumnoId } = req.user;

    // 2. Obtener datos del electivo desde el body
    const { electivo_id, prioridad } = req.body;

    // Validación simple
    if (!electivo_id) {
        return handleErrorClient(res, 400, "Debes especificar el electivo_id.");
    }

    // 3. Llamar al servicio
    const result = await createSolicitudService(alumnoId, electivo_id, prioridad);

    if (result.error) {
        // Si ya existe la solicitud es Conflict (409), si no existe el electivo es Not Found (404)
        const status = result.error.includes("Ya tienes") ? 409 : 404;
        return handleErrorClient(res, status, result.error);
    }

    return res.status(201).json({
        message: "Solicitud enviada exitosamente",
        data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getMisSolicitudes = async (req, res) => {
  try {
    // 1. Obtener ID del Alumno desde el Token
    const { id: alumnoId } = req.user;

    // 2. Llamar al servicio
    const result = await getSolicitudesPorAlumnoService(alumnoId);

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    // 3. Responder
    return res.status(200).json({
      message: "Historial de solicitudes",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getCuposPorCarrera = async (req, res) => {
  try {
    // 1. Obtener el ID del electivo desde los parámetros de la URL
    const { electivo_id } = req.params;

    if (!electivo_id) {
      return handleErrorClient(res, 400, "Debes especificar el electivo_id.");
    }

    // 2. Llamar al servicio
    const result = await getCuposPorCarreraService(Number(electivo_id));

    if (result.error) {
      const status = result.error.includes("no existe") ? 404 : 400;
      return handleErrorClient(res, status, result.error);
    }

    // 3. Responder con los cupos por carrera
    return res.status(200).json({
      message: "Cupos disponibles por carrera",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};