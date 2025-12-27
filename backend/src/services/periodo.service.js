import { AppDataSource } from "../config/configdb.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";

const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

function parseDateFromDDMMYYYY(dateString) {
    if (!dateString) return null;
    
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        throw new Error(`Formato de fecha inválido: ${dateString}. Use dd-mm-aaaa`);
    }
    
    const [day, month, year] = parts;
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error(`Formato de fecha inválido: ${dateString}. Use dd-mm-aaaa`);
    }
    
    const date = new Date(year, month - 1, day);
    
    if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
        throw new Error(`Fecha inválida: ${dateString}`);
    }
    
    return date;
}

function formatDateToDDMMYYYY(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
}

function formatPeriodoResponse(periodo) {
    if (!periodo) return null;
    
    return {
        ...periodo,
        fecha_inicio: formatDateToDDMMYYYY(periodo.fecha_inicio),
        fecha_fin: formatDateToDDMMYYYY(periodo.fecha_fin)
    };
}

export async function createPeriodoService(data) {
    const { nombre, fecha_inicio, fecha_fin, estado } = data;

    const existingPeriodo = await periodoRepository.findOneBy({ nombre });

    if (existingPeriodo) {
        throw new Error("Ya existe un periodo académico con ese nombre.");
    }

    if (estado === "INSCRIPCION") {
        const periodoInscripcionActivo = await periodoRepository.findOneBy({ estado: "INSCRIPCION" });
        if (periodoInscripcionActivo) {
            throw new Error("Ya existe un periodo en estado de inscripción activo. Solo puede haber un periodo de inscripción a la vez.");
        }
    }

    const parsedFechaInicio = parseDateFromDDMMYYYY(fecha_inicio);
    const parsedFechaFin = parseDateFromDDMMYYYY(fecha_fin);

    if (parsedFechaInicio >= parsedFechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
    }

    const nuevoPeriodo = periodoRepository.create({
        nombre,
        fecha_inicio: parsedFechaInicio,
        fecha_fin: parsedFechaFin,
        estado: estado || "PLANIFICACION"
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

    const parsedFechaInicio = fecha_inicio ? parseDateFromDDMMYYYY(fecha_inicio) : null;
    const parsedFechaFin = fecha_fin ? parseDateFromDDMMYYYY(fecha_fin) : null;

    if (parsedFechaInicio && parsedFechaFin) {
        if (parsedFechaInicio >= parsedFechaFin) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
    }

    if (parsedFechaInicio) periodo.fecha_inicio = parsedFechaInicio;
    if (parsedFechaFin) periodo.fecha_fin = parsedFechaFin;
    if (estado) periodo.estado = estado;

    const savedPeriodo = await periodoRepository.save(periodo);
    return formatPeriodoResponse(savedPeriodo);
}

export async function getAllPeriodosService() {
    const periodos = await periodoRepository.find({
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
        where: { estado: "INSCRIPCION" },
        order: { fecha_inicio: "DESC" }
    });
    return formatPeriodoResponse(periodo);
}

export async function updateEstadoPeriodoService(id, nuevoEstado) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const estadosValidos = ["PLANIFICACION", "INSCRIPCION", "SELECCION", "CERRADO"];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error("Estado no válido.");
    }

    if (nuevoEstado === "INSCRIPCION") {
        const periodoInscripcionActivo = await periodoRepository.findOne({
            where: { estado: "INSCRIPCION" }
        });
        if (periodoInscripcionActivo && periodoInscripcionActivo.id !== periodo.id) {
            throw new Error("Ya existe un periodo en estado de inscripción activo. Debe cerrar o cambiar el estado del periodo actual antes de activar otro.");
        }
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
