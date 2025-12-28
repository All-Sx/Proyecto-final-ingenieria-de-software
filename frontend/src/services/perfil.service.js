import api from "../config/axios";

export const getMyProfile = async (data) => {
    try {
        const response = await api.get("/usuarios/profile", data);
        return response.data.data || response.data
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        throw error;
    }
}
export const updateMyProfile = async (data) => {
    try {
        const response = await api.patch("/usuarios/profile", data);
        return response.data || response.data.data
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    }
}
export const updateClave = async (data) => {
    try {
        const response = await api.patch("/usuarios/profile/password", data);
        return response.data || response.data.data
    } catch (error) {
        console.error("Error al actualizar clave:", error);
        throw error;
    }
}