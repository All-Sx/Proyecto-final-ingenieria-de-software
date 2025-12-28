export const diasPorMes = (mes) => {
    const meses31 = [1, 3, 5, 7, 8, 10, 12];
    if (!mes) return [];
    if (mes === 2) return Array.from({ length: 28 }, (_, i) => i + 1);
    if (meses31.includes(mes)) return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from({ length: 30 }, (_, i) => i + 1);
};

export function formatearFecha(date) {
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const año = d.getFullYear();

    return `${dia}-${mes}-${año}`;
}