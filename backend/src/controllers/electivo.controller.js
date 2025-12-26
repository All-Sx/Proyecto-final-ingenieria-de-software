import { createElectivoService } from "../services/electivo.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createElectivo = async (req, res) => {
  try {
    const { nombre, descripcion, creditos, cupos } = req.body;

    // Validación simple
    if (!nombre || !cupos) {
      return handleErrorClient(res, 400, "Nombre y cupos del electivo son obligatorios.");
    }

    const result = await createElectivoService({ nombre, descripcion, creditos, cupos });

    if (result.error) {
      // Si dice "Ya existe", devolvemos 409 (Conflict), si no, 500
      const status = result.error.includes("Ya existe") ? 409 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(201).json({
      message: "Electivo creado exitosamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};