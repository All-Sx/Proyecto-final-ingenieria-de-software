import { createCarreraService, getAllCarrerasService } from "../services/carrera.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createCarrera = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;

    if (!codigo || !nombre) {
      return handleErrorClient(res, 400, "El código y el nombre son obligatorios.");
    }

    const result = await createCarreraService({ codigo, nombre });

    if (result.error) {
      const status = result.error.includes("Ya existe") ? 409 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(201).json({
      message: "Carrera creada exitosamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getCarreras = async (req, res) => {
  try {
    const result = await getAllCarrerasService();

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    return res.status(200).json({
      message: "Lista de carreras obtenida",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};