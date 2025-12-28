export const diasPorMes = (mes, año) => {
    if (!mes || !año) return [];

    // Febrero con año real
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
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const año = d.getFullYear();

    return `${dia}-${mes}-${año}`;
}

export const normalizarPeriodo = (periodo) => {
    if (!periodo) return null;

    return {
        ...periodo,
        fechaInicio: new Date(
            periodo.fecha_inicio.split("-").reverse().join("-")
        ),
        fechaFin: new Date(
            periodo.fecha_fin.split("-").reverse().join("-")
        ),
    };
};