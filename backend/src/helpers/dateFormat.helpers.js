/**
 * Convierte una fecha en formato dd-mm-aaaa a objeto Date
 * @param {string} dateString - Fecha en formato dd-mm-aaaa
 * @returns {Date} Objeto Date
 */
export function parseDateFromDDMMYYYY(dateString) {
    if (!dateString) return null;
    
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        throw new Error(`Formato de fecha inválido: ${dateString}. Use dd-mm-aaaa`);
    }
    
    const [day, month, year] = parts;
    
    // Validar que sean números
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error(`Formato de fecha inválido: ${dateString}. Use dd-mm-aaaa`);
    }
    
    // Crear fecha (mes es 0-indexado en JavaScript)
    const date = new Date(year, month - 1, day);
    
    // Validar que la fecha sea válida
    if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
        throw new Error(`Fecha inválida: ${dateString}`);
    }
    
    return date;
}

/**
 * Convierte un objeto Date a formato dd-mm-aaaa
 * @param {Date} date - Objeto Date
 * @returns {string} Fecha en formato dd-mm-aaaa
 */
export function formatDateToDDMMYYYY(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
}

/**
 * Formatea un objeto periodo con fechas en formato dd-mm-aaaa
 * @param {Object} periodo - Objeto periodo con fechas
 * @returns {Object} Periodo con fechas formateadas
 */
export function formatPeriodoResponse(periodo) {
    if (!periodo) return null;
    
    return {
        ...periodo,
        fecha_inicio: formatDateToDDMMYYYY(periodo.fecha_inicio),
        fecha_fin: formatDateToDDMMYYYY(periodo.fecha_fin)
    };
}
