import { createElectivoService, getElectivosService, updateElectivoService } from "../services/electivo.service.js";
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

export const getElectivos = async (req, res) => {
  try {
    const result = await getElectivosService();

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    return res.status(200).json({
      message: "Lista de electivos",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
};

export const updateElectivo = async (req, res) => {
  try {
    const { id } = req.params; // Viene de la URL (ej: /api/electivos/5)
    const datosActualizar = req.body; // Viene del JSON (ej: { "cupos": 50 })

    const result = await updateElectivoService(Number(id), datosActualizar);

    if (result.error) {
        // Si no encontrado devuelve 404, sino 500
        const status = result.error === "Electivo no encontrado" ? 404 : 500;
        return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
      message: "Electivo actualizado correctamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};