import api from "../config/axios";

export const getElectivos = async () => {
  try {
    const response = await api.get("/electivos");
    return response.data.data || response.data; 
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    throw error;
  }
};