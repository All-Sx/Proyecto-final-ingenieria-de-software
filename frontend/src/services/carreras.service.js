import api from "../config/axios";

/**
 * Obtiene todas las carreras disponibles
 * @returns {Promise<Array>} Lista de carreras
 */
export const getCarreras = async () => {
  try {
    const response = await api.get("/carreras");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    throw error;
  }
};

/**
 * Crea una nueva carrera
 * @param {Object} carreraData - Datos de la carrera (codigo, nombre)
 * @returns {Promise} Respuesta del servidor
 */
export const createCarrera = async (carreraData) => {
  try {
    const response = await api.post("/carreras", carreraData);
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};
