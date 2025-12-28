import { AppDataSource } from "../config/configdb.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";
import { validarPeriodoCreacion , validarUpdatePeriodo } from "../validators/periodo.validator.js";
import { formatPeriodoResponse } from "../mappers/periodo.mapper.js";

const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

export async function createPeriodoService(data) {
    const { nombre, fecha_inicio, fecha_fin, estado } = data;

    const existingPeriodo = await periodoRepository.findOneBy({ nombre, activo: true });

    if (existingPeriodo) {
        throw new Error("Ya existe un periodo académico activo con ese nombre.");
    }

    const { fechaInicio, fechaFin } = validarPeriodoCreacion({
        nombre,
        fecha_inicio,
        fecha_fin,
    });

    // Verificar si existe un periodo en PLANIFICACION o INSCRIPCION activo
    const periodoActivoPlanificacionOInscripcion = await periodoRepository.findOne({
        where: [
            { estado: "PLANIFICACION", activo: true },
            { estado: "INSCRIPCION", activo: true }
        ]
    });

    if (periodoActivoPlanificacionOInscripcion) {
        throw new Error(`Ya existe un periodo en estado ${periodoActivoPlanificacionOInscripcion.estado} activo. Solo puede haber un periodo en PLANIFICACION o INSCRIPCION a la vez.`);
    }

    const nuevoPeriodo = periodoRepository.create({
        nombre,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: estado || "PLANIFICACION",
        activo: true
    });

    const savedPeriodo = await periodoRepository.save(nuevoPeriodo);

    return formatPeriodoResponse(savedPeriodo);
}

export async function updatePeriodoFechasService(id, data) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const { fecha_inicio, fecha_fin, estado } = data;

    const { parsedFechaInicio, parsedFechaFin } =
    validarUpdatePeriodo({ fecha_inicio, fecha_fin })

    if (parsedFechaInicio) periodo.fecha_inicio = parsedFechaInicio;
    if (parsedFechaFin) periodo.fecha_fin = parsedFechaFin;
    if (estado) periodo.estado = estado;

    const savedPeriodo = await periodoRepository.save(periodo);
    return formatPeriodoResponse(savedPeriodo);
}

export async function getAllPeriodosService(incluirInactivos = false) {
    const whereCondition = incluirInactivos ? {} : { activo: true };
    const periodos = await periodoRepository.find({
        where: whereCondition,
        order: { fecha_inicio: "DESC" }
    });
    return periodos.map(formatPeriodoResponse);
}

export async function getPeriodoByIdService(id) {
    const periodo = await periodoRepository.findOneBy({ id });
    return formatPeriodoResponse(periodo);
}

export async function getPeriodoActualService() {
    const periodo = await periodoRepository.findOne({
        where: { estado: "INSCRIPCION", activo: true },
        order: { fecha_inicio: "DESC" }
    });
    return formatPeriodoResponse(periodo);
}

export async function updateEstadoPeriodoService(id, nuevoEstado) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    validarCambioEstadoPeriodo(nuevoEstado);

    if (nuevoEstado === "INSCRIPCION") {
        const periodoInscripcionActivo = await periodoRepository.findOne({
            where: { estado: "INSCRIPCION", activo: true }
        });
        if (periodoInscripcionActivo && periodoInscripcionActivo.id !== periodo.id) {
            throw new Error("Ya existe un periodo en estado de inscripción activo. Debe cerrar o cambiar el estado del periodo actual antes de activar otro.");
        }
    }

    if (nuevoEstado === "CERRADO" && periodo.activo) {
        periodo.activo = false;
    }

    periodo.estado = nuevoEstado;
    const savedPeriodo = await periodoRepository.save(periodo);
    return formatPeriodoResponse(savedPeriodo);
}

export async function deletePeriodoService(id) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }


    await periodoRepository.remove(periodo);
    return formatPeriodoResponse(periodo);
}

export async function getPeriodosHistorialService() {
    const periodos = await periodoRepository.find({
        where: { activo: false },
        order: { fecha_inicio: "DESC" }
    });
    return periodos.map(formatPeriodoResponse);
}

export async function archivarPeriodoService(id) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    if (!periodo.activo) {
        throw new Error("El periodo ya está archivado.");
    }

    periodo.activo = false;
    periodo.estado = "CERRADO";
    const savedPeriodo = await periodoRepository.save(periodo);
    return formatPeriodoResponse(savedPeriodo);
}
