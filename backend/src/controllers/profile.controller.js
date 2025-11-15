import { findAdminById, updateAdmin, deleteAdmin } from "../services/admin.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responsehandlers.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getPrivateProfile(req, res) {
  try {
    const adminId = req.adminId; 
    const admin = await findAdminById(adminId);

    if (!admin) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
      message: `¡Hola, ${admin.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
      adminData: admin,
    });
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener perfil privado", error.message);
  }
}

export async function updateProfile(req, res) {
  try {
    const adminId = parseInt(req.adminId, 10);

    if (isNaN(adminId)) {
    return handleErrorClient(res, 400, "ID de usuario inválido en el token");
    }
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return handleErrorClient(res, 400, "Datos para actualizar requeridos");
    }

    const updatedAdmin = await updateAdmin(adminId, data);
    handleSuccess(res, 200, "Usuario actualizado exitosamente", updatedAdmin);
  } catch (error) {
    if (error.status) {
      return handleErrorClient(res, error.status, error.message);
    }
    handleErrorServer(res, 500, "Error al actualizar usuario", error.message);
  }
}

export async function deleteProfile(req, res) {
  try {
    console.log("ID de usuario recibido:", req.userId);
    const adminId = req.adminId;
    await deleteAdmin(adminId);
    handleSuccess(res, 200, "Usuario eliminado exitosamente", { id: adminId });
  } catch (error) {
    console.error("----- ERROR DETALLADO -----", error);
    if (error.status) {
      return handleErrorClient(res, error.status, error.message);
    }
    handleErrorServer(res, 500, "Error al eliminar usuario", error.message);
  }
}