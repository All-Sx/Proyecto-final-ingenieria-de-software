import { AppDataSource } from "../config/configdb.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";

const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

// Funciones helper para manejo de fechas en formato dd-mm-aaaa
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

// Crear un nuevo periodo académico con fechas de inicio y fin
export async function createPeriodoService(data) {
    const { nombre, fecha_inicio, fecha_fin, estado } = data;

    // Verificar si ya existe un periodo con ese nombre
    const existingPeriodo = await periodoRepository.findOneBy({ nombre });

    if (existingPeriodo) {
        throw new Error("Ya existe un periodo académico con ese nombre.");
    }

    // Validar que no exista otro periodo en estado INSCRIPCION si se está creando uno con ese estado
    if (estado === "INSCRIPCION") {
        const periodoInscripcionActivo = await periodoRepository.findOneBy({ estado: "INSCRIPCION" });
        if (periodoInscripcionActivo) {
            throw new Error("Ya existe un periodo en estado de inscripción activo. Solo puede haber un periodo de inscripción a la vez.");
        }
    }

    // Parsear fechas del formato dd-mm-aaaa
    const parsedFechaInicio = parseDateFromDDMMYYYY(fecha_inicio);
    const parsedFechaFin = parseDateFromDDMMYYYY(fecha_fin);

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (parsedFechaInicio >= parsedFechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
    }

    // Crear el nuevo periodo
    const nuevoPeriodo = periodoRepository.create({
        nombre,
        fecha_inicio: parsedFechaInicio,
        fecha_fin: parsedFechaFin,
        estado: estado || "PLANIFICACION"
    });

    const savedPeriodo = await periodoRepository.save(nuevoPeriodo);
    return formatPeriodoResponse(savedPeriodo);
}

// Actualizar fechas de un periodo existente
export async function updatePeriodoFechasService(id, data) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const { fecha_inicio, fecha_fin, estado } = data;

    // Parsear fechas si se proporcionan
    const parsedFechaInicio = fecha_inicio ? parseDateFromDDMMYYYY(fecha_inicio) : null;
    const parsedFechaFin = fecha_fin ? parseDateFromDDMMYYYY(fecha_fin) : null;

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (parsedFechaInicio && parsedFechaFin) {
        if (parsedFechaInicio >= parsedFechaFin) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
    }

    // Actualizar solo los campos proporcionados
    if (parsedFechaInicio) periodo.fecha_inicio = parsedFechaInicio;
    if (parsedFechaFin) periodo.fecha_fin = parsedFechaFin;
    if (estado) periodo.estado = estado;

    const savedPeriodo = await periodoRepository.save(periodo);
    return formatPeriodoResponse(savedPeriodo);
}

// Obtener todos los periodos académicos
export async function getAllPeriodosService() {
    const periodos = await periodoRepository.find({
        order: { fecha_inicio: "DESC" }
    });
    return periodos.map(formatPeriodoResponse);
}

// Obtener un periodo por ID
export async function getPeriodoByIdService(id) {
    const periodo = await periodoRepository.findOneBy({ id });
    return formatPeriodoResponse(periodo);
}

// Obtener el periodo actual (en estado INSCRIPCION)
export async function getPeriodoActualService() {
    const periodo = await periodoRepository.findOne({
        where: { estado: "INSCRIPCION" },
        order: { fecha_inicio: "DESC" }
    });
    return formatPeriodoResponse(periodo);
}

// Cambiar el estado de un periodo
export async function updateEstadoPeriodoService(id, nuevoEstado) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const estadosValidos = ["PLANIFICACION", "INSCRIPCION", "SELECCION", "CERRADO"];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error("Estado no válido.");
    }

    // Validar que no exista otro periodo en estado INSCRIPCION al cambiar a ese estado
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

// Eliminar un periodo académico
export async function deletePeriodoService(id) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    await periodoRepository.remove(periodo);
    return formatPeriodoResponse(periodo);
}
