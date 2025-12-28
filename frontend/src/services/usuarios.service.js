import api from "../config/axios";

/**
 * Crea un nuevo usuario (alumno o profesor)
 * @param {Object} userData - Datos del usuario
 * @returns {Promise} Respuesta del servidor
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post("/usuarios/create", userData);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

/**
 * Obtiene todos los alumnos registrados
 * @returns {Promise<Array>} Lista de alumnos
 */
export const getAlumnos = async () => {
  try {
    const response = await api.get("/usuarios/alumnos");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    throw error;
  }
};

/**
 * Obtiene todos los profesores registrados
 * @returns {Promise<Array>} Lista de profesores
 */
export const getProfesores = async () => {
  try {
    const response = await api.get("/usuarios/profesores");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    throw error;
  }
};

/**
 * Asigna una carrera a un alumno
 * @param {number} alumnoId - ID del alumno
 * @param {string} carreraCodigo - Código de la carrera
 * @returns {Promise} Respuesta del servidor
 */
export const asignarCarrera = async (alumnoId, carreraCodigo) => {
  try {
    const response = await api.put(`/alumnos/${alumnoId}/asignar-carrera`, {
      carrera_codigo: carreraCodigo
    });
    return response.data;
  } catch (error) {
    console.error("Error al asignar carrera:", error);
    throw error;
  }
};
