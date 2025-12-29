import api from "../config/axios";

export const createElectivo = (electivoData) => {
  return api.post("/electivos", electivoData);
};

export const getElectivos = async () => {
  try {
    const response = await api.get("/electivos");
    return response.data.data || response.data; 
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    throw error;
  }
};

export const getMisElectivos = () => {
  return api.get("/electivos/mis-electivos");
};

export const updateElectivo = (id, data) => {
  return api.put(`/electivos/${id}`, data);
};

export const getElectivosAprobados = () => {
  return api.get("/electivos/aprobados");
};