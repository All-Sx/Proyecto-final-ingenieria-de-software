import { AppDataSource } from "../config/configdb.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";

const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

// Crear un nuevo periodo académico con fechas de inicio y fin
export async function createPeriodoService(data) {
    const { nombre, fecha_inicio, fecha_fin, estado } = data;

    // Verificar si ya existe un periodo con ese nombre
    const existingPeriodo = await periodoRepository.findOneBy({ nombre });

    if (existingPeriodo) {
        throw new Error("Ya existe un periodo académico con ese nombre.");
    }

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
    }

    // Crear el nuevo periodo
    const nuevoPeriodo = periodoRepository.create({
        nombre,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        estado: estado || "PLANIFICACION"
    });

    return await periodoRepository.save(nuevoPeriodo);
}

// Actualizar fechas de un periodo existente
export async function updatePeriodoFechasService(id, data) {
    const periodo = await periodoRepository.findOneBy({ id });

    if (!periodo) {
        throw new Error("Periodo académico no encontrado.");
    }

    const { fecha_inicio, fecha_fin, estado } = data;

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (fecha_inicio && fecha_fin) {
        if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
    }

    // Actualizar solo los campos proporcionados
    if (fecha_inicio) periodo.fecha_inicio = new Date(fecha_inicio);
    if (fecha_fin) periodo.fecha_fin = new Date(fecha_fin);
    if (estado) periodo.estado = estado;

    return await periodoRepository.save(periodo);
}

// Obtener todos los periodos académicos
export async function getAllPeriodosService() {
    return await periodoRepository.find({
        order: { fecha_inicio: "DESC" }
    });
}

// Obtener un periodo por ID
export async function getPeriodoByIdService(id) {
    return await periodoRepository.findOneBy({ id });
}

// Obtener el periodo actual (en estado INSCRIPCION)
export async function getPeriodoActualService() {
    return await periodoRepository.findOne({
        where: { estado: "INSCRIPCION" },
        order: { fecha_inicio: "DESC" }
    });
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
    return await periodoRepository.save(periodo);
}
