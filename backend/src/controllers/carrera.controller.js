import carreraService from "../services/carrera.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function createCarrera(req, res) {
    try {
        const data = req.body;
        const newCarrera = await carreraService.createCarrera(data);
        handleSuccess(res, 201, "Carrera creada exitosamente", newCarrera);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
export async function getCarreraByCodigo(req, res) {
    try {
        const { codigo } = req.params;
        const carrera = await carreraService.findCarreraByCodigo(codigo);
        if (!carrera) {
            return handleErrorClient(res, 404, "Carrera no encontrada");
        }
        handleSuccess(res, 200, "Carrera encontrada", carrera);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
export async function updateCarrera(req, res) {
    try {
        const { codigo } = req.params;
        const data = req.body;
        await carreraService.updateCarrera(codigo, data);
        handleSuccess(res, 200, "Carrera actualizada exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function deleteCarrera(req, res) {
    try {
        const { codigo } = req.params;
        await carreraService.deleteCarrera(codigo);
        handleSuccess(res, 200, "Carrera eliminada exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function getAllCarreras(req, res) {
    try {
        const carreras = await carreraService.getAllCarreras();
        handleSuccess(res, 200, "Carreras obtenidas exitosamente", carreras);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
