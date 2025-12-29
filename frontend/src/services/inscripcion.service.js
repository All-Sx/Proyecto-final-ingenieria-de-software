import api from "../config/axios";

export const createSolicitud = async (data) => {
    try {
        const response = await api.post("/inscripciones", data);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        throw error;
    }
}

export const getMisSolicitudes = async () => {
    try {
        const response = await api.get("/inscripciones/solicitudes");
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        throw error;
    }
}

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

export const getCuposPorCarrera = async (electivo_id) => {
  try {
    const response = await api.get(`/inscripciones/cupos/${electivo_id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener cupos:", error);
    throw error;
  }
};


