import api from "../config/axios";

/**
 * Crea una solicitud de inscripción a un electivo con prioridad
 * @param {number} electivo_id - ID del electivo
 * @param {number} prioridad - Prioridad de la inscripción (1 = más importante)
 * @returns {Promise} Respuesta del servidor
 */
export const crearSolicitudInscripcion = async (electivo_id, prioridad) => {
  try {
    const response = await api.post("/inscripciones", {
      electivo_id,
      prioridad
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    throw error;
  }
};

/**
 * Obtiene todas las solicitudes de inscripción del alumno actual
 * @returns {Promise<Array>} Lista de solicitudes
 */
export const getMisSolicitudes = async () => {
  try {
    const response = await api.get("/inscripciones/mis-solicitudes");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    throw error;
  }
};

/**
 * Obtiene los cupos disponibles por carrera para un electivo
 * @param {number} electivo_id - ID del electivo
 * @returns {Promise} Información de cupos por carrera
 */
export const getCuposPorCarrera = async (electivo_id) => {
  try {
    const response = await api.get(`/inscripciones/cupos/${electivo_id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener cupos:", error);
    throw error;
  }
};
