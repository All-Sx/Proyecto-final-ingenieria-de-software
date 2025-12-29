export function formatDateToDDMMYYYY(date) {
  if (!date) return null;

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatPeriodoResponse(periodo) {
  if (!periodo) return null;

  return {
    id: periodo.id,
    nombre: periodo.nombre,
    fecha_inicio: formatDateToDDMMYYYY(periodo.fecha_inicio),
    fecha_fin: formatDateToDDMMYYYY(periodo.fecha_fin),
    estado: periodo.estado,
    activo: periodo.activo,
  };
}
