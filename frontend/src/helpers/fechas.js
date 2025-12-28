export const diasPorMes = (mes) => {
  const meses31 = [1,3,5,7,8,10,12];
  if (!mes) return [];
  if (mes === 2) return Array.from({ length: 28 }, (_, i) => i + 1);
  if (meses31.includes(mes)) return Array.from({ length: 31 }, (_, i) => i + 1);
  return Array.from({ length: 30 }, (_, i) => i + 1);
};