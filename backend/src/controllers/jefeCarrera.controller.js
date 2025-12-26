import { createJefeCarreraService, findAllJefesService, findJefeByRutService } from "../services/jefeCarrera.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../utils/response.handlers.js"; 

// 1. Crear un Jefe de Carrera
export async function createJefeCarrera(req, res) {
    try {
        const data = req.body;

        // Validación básica de entrada
        if (!data.rut || !data.email || !data.password || !data.nombre_completo) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios (rut, email, password, nombre_completo)");
        }

        const newJefe = await createJefeCarreraService(data);

        handleSuccess(res, 201, "Jefe de Carrera creado exitosamente", newJefe);

    } catch (error) {
        // Si el error es conocido (ej: usuario duplicado), es error de cliente (400)
        // Si es desconocido, es error de servidor (500)
        if (error.message.includes("ya existe") || error.message.includes("rol")) {
            handleErrorClient(res, 409, "Error al crear usuario", { reason: error.message });
        } else {
            handleErrorServer(res, 500, "Error interno al crear Jefe de Carrera", error.message);
        }
    }
}

// 2. Obtener todos los Jefes de Carrera
export async function getJefesCarrera(req, res) {
    try {
        const jefes = await findAllJefesService();

        if (!jefes || jefes.length === 0) {
            return handleSuccess(res, 200, "No se encontraron Jefes de Carrera registrados", []);
        }

        handleSuccess(res, 200, "Lista de Jefes de Carrera obtenida", jefes);

    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener la lista", error.message);
    }
}

// 3. Buscar Jefe de Carrera por RUT
export async function getJefeByRut(req, res) {
    try {
        const { rut } = req.params; // Asumiendo que viene por URL: /jefes/:rut

        if (!rut) {
            return handleErrorClient(res, 400, "El RUT es obligatorio");
        }

        const jefe = await findJefeByRutService(rut);

        if (!jefe) {
            return handleErrorClient(res, 404, "Jefe de Carrera no encontrado", { rut_buscado: rut });
        }

        // Limpiamos el hash antes de enviar (aunque el service ya podría hacerlo)
        const { password_hash, ...safeData } = jefe;

        handleSuccess(res, 200, "Jefe de Carrera encontrado", safeData);

    } catch (error) {
        handleErrorServer(res, 500, "Error al buscar Jefe de Carrera", error.message);
    }
}