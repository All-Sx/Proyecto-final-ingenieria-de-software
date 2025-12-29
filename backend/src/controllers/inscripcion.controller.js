import { createSolicitudService, getSolicitudesPorAlumnoService, getCuposPorCarreraService, deleteSolicitudService } from "../services/inscripcion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/response.handlers.js";

export const createSolicitud = async (req, res) => {
  try {
    const { id: alumnoId } = req.user;

    const { electivo_id, prioridad } = req.body;

    if (!electivo_id) {
      return handleErrorClient(res, 400, "Debes especificar el electivo_id.");
    }

    if (!prioridad) {
      return handleErrorClient(res, 400, "Debes especificar la prioridad (número entero mayor o igual a 1).");
    }

    const result = await createSolicitudService(alumnoId, electivo_id, prioridad);

    if (result.error) {
      const status = result.error.includes("Ya tienes") ? 409 : 404;
      return handleErrorClient(res, status, result.error);
    }

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

export const deleteSolicitud = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const { id_solicitud } = req.params;

    const result = await deleteSolicitudService(id_solicitud, id_usuario);

    handleSuccess(res, 200, "Solicitud eliminado.", result);

    return res.status(200).json({
      message: "Solicitud eliminada exitosamente",
      data: result
    });
  } catch (error) {
    if (error.message.includes("No existe")) {
      handleErrorClient(res, 409, "Error al eliminar solicitud", { reason: error.message });
    } else {
      handleErrorServer(res, 500, "Error interno al eliminar solicitud", error.message);
    }
  }
}
