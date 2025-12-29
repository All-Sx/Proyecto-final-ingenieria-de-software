export const diasPorMes = (mes, año) => {
    if (!mes || !año) return [];

    if (mes === 2) {
        const esBisiesto =
            (año % 4 === 0 && año % 100 !== 0) || año % 400 === 0;
        return Array.from({ length: esBisiesto ? 29 : 28 }, (_, i) => i + 1);
    }

    const meses31 = [1, 3, 5, 7, 8, 10, 12];
    const dias = meses31.includes(mes) ? 31 : 30;

    return Array.from({ length: dias }, (_, i) => i + 1);
};


export function formatearFecha(date) {
    const d = new Date(date);
    const dia = String(d.getUTCDate()).padStart(2, "0");
    const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
    const año = d.getUTCFullYear();

    return `${dia}-${mes}-${año}`;
}

export const normalizarPeriodo = (periodo) => {
    if (!periodo) return null;

    // Parsear la fecha en formato dd-mm-yyyy
    const [diaInicio, mesInicio, añoInicio] = periodo.fecha_inicio.split("-");
    const [diaFin, mesFin, añoFin] = periodo.fecha_fin.split("-");

    return {
        ...periodo,
        fechaInicio: new Date(Date.UTC(añoInicio, mesInicio - 1, diaInicio, 12, 0, 0)),
        fechaFin: new Date(Date.UTC(añoFin, mesFin - 1, diaFin, 12, 0, 0)),
    };
};