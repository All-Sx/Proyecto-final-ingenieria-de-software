import electivoService from "../services/electivo.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function createElectivo(req, res) {
    try {
        const data = req.body;
        const newElectivo = await electivoService.createElectivo(data);
        handleSuccess(res, 201, "Electivo creado exitosamente", newElectivo);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function getElectivoByCodigo(req, res) {
    try {
        const { codigo } = req.params;
        const electivo = await electivoService.findElectivoByCodigo(codigo);
        if (!electivo) {
            return handleErrorClient(res, 404, "Electivo no encontrado");
        }
        handleSuccess(res, 200, "Electivo encontrado", electivo);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function updateElectivo(req, res) {
    try {
        const { codigo } = req.params;
        const data = req.body;
        await electivoService.updateElectivo(codigo, data);
        handleSuccess(res, 200, "Electivo actualizado exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function deleteElectivo(req, res) {
    try {
        const { codigo } = req.params;
        await electivoService.deleteElectivo(codigo);
        handleSuccess(res, 200, "Electivo eliminado exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function getAllElectivos(req, res) {
    try {
        const electivos = await electivoService.getAllElectivos();
        handleSuccess(res, 200, "Electivos obtenidos exitosamente", electivos);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}