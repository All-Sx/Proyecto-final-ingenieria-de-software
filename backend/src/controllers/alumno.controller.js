import alumnoService from "../services/alumno.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function createAlumno(req, res) {
    try {
        const data = req.body;
        const newAlumno = await alumnoService.createAlumno(data);
        handleSuccess(res, 201, "Alumno creado exitosamente", newAlumno);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
export async function getAlumnoByRut(req, res) {
    try {
        const { rut } = req.params;
        const alumno = await alumnoService.findAlumnoByRut(rut);
        if (!alumno) {
            return handleErrorClient(res, 404, "Alumno no encontrado");
        }
        handleSuccess(res, 200, "Alumno encontrado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
export async function updateAlumno(req, res) {
    try {
        const { rut } = req.params;
        const data = req.body;
        await alumnoService.updateAlumno(rut, data);
        handleSuccess(res, 200, "Alumno actualizado exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function deleteAlumno(req, res) {
    try {
        const { rut } = req.params;
        await alumnoService.deleteAlumno(rut);
        handleSuccess(res, 200, "Alumno eliminado exitosamente");
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, "Error interno del servidor", error.message);
        }
    }
}
export async function getAllAlumnos(req, res) {
    try {
        const alumnos = await alumnoService.getAllAlumnos();
        handleSuccess(res, 200, "Alumnos obtenidos exitosamente", alumnos);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}