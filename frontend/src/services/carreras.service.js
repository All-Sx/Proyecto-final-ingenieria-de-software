import api from "../config/axios";

export const getCarreras = async () => {
  try {
    const response = await api.get("/carreras");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    throw error;
  }
};

export const createCarrera = async (carreraData) => {
  try {
    const response = await api.post("/carreras", carreraData);
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};
