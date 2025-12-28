import api from "../config/axios";

// Crear periodo
export const crearPeriodo = (data) => {
  return api.post("/periodos", data);
};

// Obtener periodo actual
export const obtenerPeriodoActual = () => {
  return api.get("/periodos/actual");
};

// Actualizar fechas (extender cierre)
export const actualizarPeriodo = (id, data) => {
  return api.put(`/periodos/${id}`, data);
};

// Cambiar estado (cerrar periodo)
export const cambiarEstadoPeriodo = (id, estado) => {
  return api.patch(`/periodos/${id}/estado`, { estado });
};