import { createAlumno, deleteAlumno, findAlumnoByRut, getAllAlumnos, updateAlumno } from "../services/alumno.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function createAlumnoController(req, res) {
    try {
        const alumno = await createAlumno(req.body);
        handleSuccess(res, alumno, 201);
    } catch (error) {
        handleErrorServer(res, error);
    }
}

export async function getAllAlumnosController(req, res) {
    try {
        const alumnos = await getAllAlumnos();
        handleSuccess(res, alumnos);
    } catch (error) {
        handleErrorServer(res, error);
    }
}
export async function getAlumnoByRutController(req, res) {
    try {
        const { rut } = req.params;
        const alumno = await findAlumnoByRut(rut);
        if (!alumno) {
            return handleErrorClient(res, "Alumno no encontrado", 404);
        }
        handleSuccess(res, alumno);
    } catch (error) {
        handleErrorServer(res, error);
    }
}

export async function updateAlumnoController(req, res) {
    try {
        const { rut } = req.params;
        const alumno = await findAlumnoByRut(rut);
        if (!alumno) {
            return handleErrorClient(res, "Alumno no encontrado", 404);
        }
        await updateAlumno(rut, req.body);
        handleSuccess(res, { message: "Alumno actualizado correctamente" });
    } catch (error) {
        handleErrorServer(res, error);
    }
}
export async function deleteAlumnoController(req, res) {
    try {
        const { rut } = req.params;
        const alumno = await findAlumnoByRut(rut);
        if (!alumno) {
            return handleErrorClient(res, "Alumno no encontrado", 404);
        }
        await deleteAlumno(rut);
        handleSuccess(res, { message: "Alumno eliminado correctamente" });
    } catch (error) {
        handleErrorServer(res, error);
    }
}
