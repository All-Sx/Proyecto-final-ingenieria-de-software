import { AppDataSource } from "../config/configdb.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";

const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

// Función auxiliar para convertir fechas DD-MM-YYYY a objeto Date
function parseFecha(fechaStr) {
    // Si la fecha viene en formato DD-MM-YYYY
    if (fechaStr.includes('-')) {
        const partes = fechaStr.split('-');
        if (partes[0].length <= 2) {
            // Formato DD-MM-YYYY
            const [dia, mes, anio] = partes;
            return new Date(`${anio}-${mes}-${dia}`);
        }
    }
    // Si no, intentar parsear directamente
    return new Date(fechaStr);
}

// Función auxiliar para formatear fecha a DD-MM-YYYY
function formatFecha(fecha) {
    if (!fecha) return null;
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

// Función para formatear un periodo completo
function formatPeriodo(periodo) {
    if (!periodo) return null;
    return {
        ...periodo,
        fecha_inicio: formatFecha(periodo.fecha_inicio),
        fecha_fin: formatFecha(periodo.fecha_fin)
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

    // Convertir fechas
    const fechaInicio = parseFecha(fecha_inicio);
    const fechaFin = parseFecha(fecha_fin);

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (fechaInicio >= fechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
    }

    // Crear el nuevo periodo
    const nuevoPeriodo = periodoRepository.create({
        nombre,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: estado || "PLANIFICACION"
    });

    const periodoGuardado = await periodoRepository.save(nuevoPeriodo);
    return formatPeriodo(periodoGuardado);
}

// Actualizar fechas de un periodo existente
export async function updatePeriodoFechasService(id, data) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const { fecha_inicio, fecha_fin, estado } = data;

    // Convertir fechas si están presentes
    const fechaInicio = fecha_inicio ? parseFecha(fecha_inicio) : null;
    const fechaFin = fecha_fin ? parseFecha(fecha_fin) : null;

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (fechaInicio && fechaFin) {
        if (fechaInicio >= fechaFin) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
    }

    // Actualizar solo los campos proporcionados
    if (fechaInicio) periodo.fecha_inicio = fechaInicio;
    if (fechaFin) periodo.fecha_fin = fechaFin;
    if (estado) periodo.estado = estado;

    const periodoActualizado = await periodoRepository.save(periodo);
    return formatPeriodo(periodoActualizado);
}

// Obtener todos los periodos académicos
export async function getAllPeriodosService() {
    const periodos = await periodoRepository.find({
        order: { fecha_inicio: "DESC" }
    });
    return periodos.map(periodo => formatPeriodo(periodo));
}

// Obtener un periodo por ID
export async function getPeriodoByIdService(id) {
    const periodo = await periodoRepository.findOneBy({ id });
    return formatPeriodo(periodo);
}

// Obtener el periodo actual (en estado INSCRIPCION)
export async function getPeriodoActualService() {
    const periodo = await periodoRepository.findOne({
        where: { estado: "INSCRIPCION" },
        order: { fecha_inicio: "DESC" }
    });
    return formatPeriodo(periodo);
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

    periodo.estado = nuevoEstado;
    const periodoActualizado = await periodoRepository.save(periodo);
    return formatPeriodo(periodoActualizado);
}
