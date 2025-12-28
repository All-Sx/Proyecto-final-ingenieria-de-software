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

export function validarPeriodoCreacion({ nombre, fecha_inicio, fecha_fin }) {
    if (!nombre || !fecha_inicio || !fecha_fin) {
        throw new Error(
            "Faltan datos obligatorios (nombre, fecha_inicio, fecha_fin)"
        );
    }

    const fechaInicio = parseDateFromDDMMYYYY(fecha_inicio);
    const fechaFin = parseDateFromDDMMYYYY(fecha_fin);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaInicio < hoy) {
        throw new Error("La fecha de inicio no puede ser anterior a hoy.");
    }

    if (fechaInicio >= fechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
    }

    return { fechaInicio, fechaFin };
}

export function validarCambioEstadoPeriodo(nuevoEstado) {
    const estadosValidos = ["PLANIFICACION", "INSCRIPCION", "CERRADO"];

    if (!nuevoEstado) {
        throw new Error("El estado es obligatorio.");
    }

    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error("Estado no válido.");
    }

    return nuevoEstado;
}

export function validarUpdatePeriodo({ fecha_inicio, fecha_fin }) {
    let parsedFechaInicio = null;
    let parsedFechaFin = null;

    if (fecha_inicio) {
        parsedFechaInicio = parseDateFromDDMMYYYY(fecha_inicio);
    }

    if (fecha_fin) {
        parsedFechaFin = parseDateFromDDMMYYYY(fecha_fin);
    }

    if (parsedFechaInicio && parsedFechaFin) {
        if (parsedFechaInicio >= parsedFechaFin) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
    }

    return {
        parsedFechaInicio,
        parsedFechaFin,
    };
}