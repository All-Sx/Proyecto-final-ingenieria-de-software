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

export const updateElectivo = async (id, data) => {
  try {
    const response = await api.put(`/electivos/${id}`, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    throw error;
  }
};

export const aprobarElectivo = async (id) => {
  try {
    const response = await api.put(`/electivos/${id}`, { estado: "APROBADO" });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al aprobar electivo:", error);
    throw error;
  }
};

export const rechazarElectivo = async (id) => {
  try {
    const response = await api.put(`/electivos/${id}`, { estado: "RECHAZADO" });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al rechazar electivo:", error);
    throw error;
  }
};