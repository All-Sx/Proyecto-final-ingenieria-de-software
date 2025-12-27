import { asignarCarreraService } from "../services/alumno.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const asignarCarrera = async (req, res) => {
  try {
    const { id } = req.params; // ID del Usuario (Alumno)
    const { carrera_codigo } = req.body; 

    if (!carrera_codigo) {
        return handleErrorClient(res, 400, "El código de la carrera es obligatorio.");
    }

    const result = await asignarCarreraService(Number(id), carrera_codigo);

    if (result.error) {
        const status = result.error.includes("no encontrado") ? 404 : 409;
        return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
        message: "Carrera asignada correctamente al alumno.",
        data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};