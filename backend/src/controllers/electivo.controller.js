import { createElectivoService, getElectivosService, getElectivosByProfesorService, updateElectivoService, getElectivosAprovadosService } from "../services/electivo.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createElectivo = async (req, res) => {
  try {
    // 1. Extraer datos del cuerpo de la petición
    const { nombre, descripcion, creditos, cupos, estado } = req.body;

    // PASO 1: Obtener el nombre del profesor del usuario autenticado
    // req.user viene del authMiddleware que decodifica el JWT
    const nombreProfesor = req.user?.nombre_completo;

    // Validar que el usuario esté autenticado y tenga nombre
    if (!nombreProfesor) {
      return handleErrorClient(res, 401, "Usuario no autenticado o sin nombre.");
    }

    // 2. Validar campos obligatorios
    if (!nombre || !cupos) {
      return handleErrorClient(res, 400, "Nombre y cupos del electivo son obligatorios.");
    }

    // 3. Normalizar el estado a mayúsculas si existe
    // Esto permite que envíen "pendiente", "Pendiente" o "PENDIENTE"
    const estadoNormalizado = estado ? estado.toUpperCase() : undefined;

    // 4. Validar que no intenten enviar estados no permitidos
    // Los profesores solo pueden crear electivos en estado PENDIENTE (o no enviar estado)
    // No pueden crear directamente como APROBADO o RECHAZADO
    if (estadoNormalizado && estadoNormalizado !== "PENDIENTE") {
      return handleErrorClient(res, 400, "Solo puedes crear electivos en estado PENDIENTE. Los estados APROBADO y RECHAZADO solo pueden ser asignados por el Jefe de Carrera.");
    }

    // PASO 2: Llamar al servicio pasando los datos Y el nombre del profesor
    const result = await createElectivoService({ nombre, descripcion, creditos, cupos }, nombreProfesor);

    if (result.error) {
      const status = result.error.includes("Ya existe") ? 409 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(201).json({
      message: "Electivo creado exitosamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getElectivos = async (req, res) => {
  try {
    const result = await getElectivosService();

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    return res.status(200).json({
      message: "Lista de electivos",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
};

// NUEVO CONTROLADOR: Para que un profesor vea SOLO sus electivos
// Filtra por el nombre del profesor que está en el token JWT
export const getMisElectivos = async (req, res) => {
  try {
    // PASO 1: Obtener el nombre del profesor del token JWT
    const nombreProfesor = req.user?.nombre_completo;

    if (!nombreProfesor) {
      return handleErrorClient(res, 401, "Usuario no autenticado.");
    }

    // PASO 2: Llamar al servicio que filtra por nombre_profesor
    const result = await getElectivosByProfesorService(nombreProfesor);

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    // PASO 3: Devolver solo los electivos de este profesor
    return res.status(200).json({
      message: "Lista de tus electivos",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
};

export const updateElectivo = async (req, res) => {
  try {
    const { id } = req.params; // Viene de la URL (ej: /api/electivos/5)
    const datosActualizar = req.body; // Viene del JSON (ej: { "cupos": 50 })

    const result = await updateElectivoService(Number(id), datosActualizar);

    if (result.error) {
      // Si no encontrado devuelve 404, sino 500
      const status = result.error === "Electivo no encontrado" ? 404 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
      message: "Electivo actualizado correctamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getElectivosAprovados = async (req, res) => {
  try {
    const result = await getElectivosAprovadosService();

    if (result.error) return handleErrorClient(res, 500, result.error);

    return res.status(200).json({
      message: "Lista de electivos aprovados",
      data: result.data
    });
  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
}