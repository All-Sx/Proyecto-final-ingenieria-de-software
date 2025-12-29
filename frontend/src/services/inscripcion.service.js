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