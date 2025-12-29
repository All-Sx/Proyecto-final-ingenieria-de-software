import {
    createPeriodoService,
    updatePeriodoFechasService,
    getAllPeriodosService,
    getPeriodoByIdService,
    getPeriodoActualService,
    updateEstadoPeriodoService,
    deletePeriodoService,
    getPeriodosHistorialService,
    archivarPeriodoService
} from "../services/periodo.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";


export async function createPeriodo(req, res) {
    try {
        const { nombre, fecha_inicio, fecha_fin, estado } = req.body;

        
        if (!nombre || !fecha_inicio || !fecha_fin) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios (nombre, fecha_inicio, fecha_fin). Las fechas deben estar en formato dd-mm-aaaa");
        }

        const nuevoPeriodo = await createPeriodoService({
            nombre,
            fecha_inicio,
            fecha_fin,
            estado
        });

        handleSuccess(res, 201, "Periodo académico creado exitosamente", nuevoPeriodo);

    } catch (error) {
        console.error("ERROR CREATE PERIODO:", error); 
        if (error.message.includes("ya existe") || error.message.includes("fecha") || error.message.includes("Formato") || error.message.includes("inválido")) {
            handleErrorClient(res, 409, error.message);
        } else {
            handleErrorServer(res, 500, "Error al crear el periodo académico", error.message);
        }
    }
}


export async function updatePeriodoFechas(req, res) {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, estado, nombre } = req.body;

        if (!fecha_inicio && !fecha_fin && !estado) {
            return handleErrorClient(res, 400, "Debe proporcionar al menos fecha_inicio, fecha_fin o estado. Las fechas deben estar en formato dd-mm-aaaa");
        }

        const periodoActualizado = await updatePeriodoFechasService(id, {
            nombre,
            fecha_inicio,
            fecha_fin,
            estado
        });

        handleSuccess(res, 200, "Periodo académico actualizado exitosamente", periodoActualizado);

    } catch (error) {
        if (error.message.includes("no encontrado") || error.message.includes("fecha") || error.message.includes("Formato") || error.message.includes("inválido")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error al actualizar el periodo", error.message);
        }
    }
}


export async function getAllPeriodos(req, res) {
    try {
        const { incluir_historial } = req.query;
        const incluirInactivos = incluir_historial === 'true';
        
        const periodos = await getAllPeriodosService(incluirInactivos);

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
        const esJefe = req.user?.rol === "Jefe de Carrera";
        const esProfe = req.user?.rol === "Profesor";

        const periodoActual = await getPeriodoActualService({
            incluirPlanificacion: esJefe || esProfe
        });

        if (!periodoActual) {
            return handleSuccess(res, 200, "No hay período disponible", null);
        }

        handleSuccess(res, 200, "Periodo actual", periodoActual);

    } catch (error) {
        handleErrorServer(
            res,
            500,
            "Error al obtener el periodo actual",
            error.message
        );
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

export async function deletePeriodo(req, res) {
    try {
        const { id } = req.params;

        const periodoEliminado = await deletePeriodoService(id);

        handleSuccess(res, 200, "Periodo académico eliminado exitosamente", periodoEliminado);

    } catch (error) {
        if (error.message.includes("no encontrado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error al eliminar el periodo", error.message);
        }
    }
}

export async function getPeriodosHistorial(req, res) {
    try {
        const periodosHistorial = await getPeriodosHistorialService();

        if (!periodosHistorial || periodosHistorial.length === 0) {
            return handleSuccess(res, 200, "No hay periodos en el historial", []);
        }

        handleSuccess(res, 200, "Historial de periodos cerrados", periodosHistorial);

    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener el historial de periodos", error.message);
    }
}

export async function archivarPeriodo(req, res) {
    try {
        const { id } = req.params;

        const periodoArchivado = await archivarPeriodoService(id);

        handleSuccess(res, 200, "Periodo archivado exitosamente", periodoArchivado);

    } catch (error) {
        if (error.message.includes("no encontrado") || error.message.includes("archivado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error al archivar el periodo", error.message);
        }
    }
}
