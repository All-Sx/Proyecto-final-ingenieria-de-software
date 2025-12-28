import api from "../config/axios";


export const crearPeriodo = (data) => {
  return api.post("/periodos", data);
};

export const obtenerPeriodoActual = () => {
  return api.get("/periodos/actual");
};

export const actualizarPeriodo = (id, data) => {
  return api.put(`/periodos/${id}`, data);
};

export const cambiarEstadoPeriodo = (id, estado) => {
  return api.patch(`/periodos/${id}/estado`, { estado });
};

export const obtenerHistorialPeriodos = () => {
  return api.get("/periodos/historial");
};