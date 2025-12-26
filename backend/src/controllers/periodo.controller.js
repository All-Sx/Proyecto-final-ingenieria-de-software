import {
    createPeriodoService,
    updatePeriodoFechasService,
    getAllPeriodosService,
    getPeriodoByIdService,
    getPeriodoActualService,
    updateEstadoPeriodoService
} from "../services/periodo.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";


export async function createPeriodo(req, res) {
    try {
        const { nombre, fecha_inicio, fecha_fin, estado } = req.body;

        
        if (!nombre || !fecha_inicio || !fecha_fin) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios (nombre, fecha_inicio, fecha_fin)");
        }

        const nuevoPeriodo = await createPeriodoService({
            nombre,
            fecha_inicio,
            fecha_fin,
            estado
        });

        handleSuccess(res, 201, "Periodo académico creado exitosamente", nuevoPeriodo);

    } catch (error) {
        if (error.message.includes("ya existe") || error.message.includes("fecha")) {
            handleErrorClient(res, 409, error.message);
        } else {
            handleErrorServer(res, 500, "Error al crear el periodo académico", error.message);
        }
    }
}


export async function updatePeriodoFechas(req, res) {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, estado } = req.body;

        if (!fecha_inicio && !fecha_fin && !estado) {
            return handleErrorClient(res, 400, "Debe proporcionar al menos fecha_inicio, fecha_fin o estado");
        }

        const periodoActualizado = await updatePeriodoFechasService(id, {
            fecha_inicio,
            fecha_fin,
            estado
        });

        handleSuccess(res, 200, "Periodo académico actualizado exitosamente", periodoActualizado);

    } catch (error) {
        if (error.message.includes("no encontrado") || error.message.includes("fecha")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error al actualizar el periodo", error.message);
        }
    }
}


export async function getAllPeriodos(req, res) {
    try {
        const periodos = await getAllPeriodosService();

        if (!periodos || periodos.length === 0) {
            return handleSuccess(res, 200, "No hay periodos académicos registrados", []);
        }

        handleSuccess(res, 200, "Lista de periodos académicos", periodos);

    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener periodos", error.message);
    }
}


export async function getPeriodoById(req, res) {
    try {
        const { id } = req.params;

        const periodo = await getPeriodoByIdService(id);

        if (!periodo) {
            return handleErrorClient(res, 404, "Periodo académico no encontrado");
        }

        handleSuccess(res, 200, "Periodo académico encontrado", periodo);

    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener el periodo", error.message);
    }
}


export async function getPeriodoActual(req, res) {
    try {
        const periodoActual = await getPeriodoActualService();

        if (!periodoActual) {
            return handleSuccess(res, 200, "No hay periodo de inscripción activo", null);
        }

        handleSuccess(res, 200, "Periodo actual", periodoActual);

    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener el periodo actual", error.message);
    }
}

export async function updateEstadoPeriodo(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return handleErrorClient(res, 400, "El estado es obligatorio");
        }

        const periodoActualizado = await updateEstadoPeriodoService(id, estado);

        handleSuccess(res, 200, "Estado del periodo actualizado", periodoActualizado);

    } catch (error) {
        if (error.message.includes("no encontrado") || error.message.includes("válido")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error al actualizar el estado", error.message);
        }
    }
}
