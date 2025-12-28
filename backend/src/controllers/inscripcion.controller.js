import { createSolicitudService, getSolicitudesPorAlumnoService, getCuposPorCarreraService } from "../services/inscripcion.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createSolicitud = async (req, res) => {
  try {
    const { id: alumnoId } = req.user;

    const { electivo_id, prioridad } = req.body;

    if (!electivo_id) {
        return handleErrorClient(res, 400, "Debes especificar el electivo_id.");
    }

    const result = await createSolicitudService(alumnoId, electivo_id, prioridad);

    if (result.error) {
        const status = result.error.includes("Ya tienes") ? 409 : 404;
        return handleErrorClient(res, status, result.error);
    }

    // Usar el mensaje del servicio (puede ser PENDIENTE o LISTA_ESPERA)
    return res.status(201).json({
        message: result.message || "Solicitud enviada exitosamente",
        data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getMisSolicitudes = async (req, res) => {
  try {
   
    const { id: alumnoId } = req.user;

   
    const result = await getSolicitudesPorAlumnoService(alumnoId);

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    
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
    const { electivo_id } = req.params;

    if (!electivo_id) {
      return handleErrorClient(res, 400, "Debes especificar el electivo_id.");
    }

    const result = await getCuposPorCarreraService(parseInt(electivo_id));

    if (result.error) {
      const status = result.error.includes("no existe") ? 404 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
      message: "Cupos disponibles por carrera",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};