import { createJefeCarreraService, findAllJefesService, findJefeByRutService } from "../services/jefeCarrera.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js"; 

export async function createJefeCarrera(req, res) {
    try {
        const data = req.body;

        if (!data.rut || !data.email || !data.password || !data.nombre_completo) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios (rut, email, password, nombre_completo)");
        }

        const newJefe = await createJefeCarreraService(data);

        handleSuccess(res, 201, "Jefe de Carrera creado exitosamente", newJefe);

    } catch (error) {

        if (error.message.includes("ya existe") || error.message.includes("rol")) {
            handleErrorClient(res, 409, "Error al crear usuario", { reason: error.message });
        } else {
            handleErrorServer(res, 500, "Error interno al crear Jefe de Carrera", error.message);
        }
    }
}


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


export async function getJefeByRut(req, res) {
    try {
        const { rut } = req.params; 

        if (!rut) {
            return handleErrorClient(res, 400, "El RUT es obligatorio");
        }

        const jefe = await findJefeByRutService(rut);

        if (!jefe) {
            return handleErrorClient(res, 404, "Jefe de Carrera no encontrado", { rut_buscado: rut });
        }

        
        const { password_hash, ...safeData } = jefe;

        handleSuccess(res, 200, "Jefe de Carrera encontrado", safeData);

    } catch (error) {
        handleErrorServer(res, 500, "Error al buscar Jefe de Carrera", error.message);
    }
}