import { createAlumno, deleteAlumno, findAlumnoByRut, getAllAlumnos, updateAlumno } from "../services/alumno.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responsehandlers.js";

export async function createAlumnoController(req, res) {
    try {
        const alumno = await createAlumno(req.body);
        handleSuccess(res, 201, "Alumno creado exitosamente", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message, error);
    }
}

export async function getAllAlumnosController(req, res) {
    try {
        const alumnos = await getAllAlumnos();
        handleSuccess(res, 200, "Alumnos obtenidos", alumnos);
    } catch (error) {
        handleErrorServer(res, 500, error.message, error);
    }
}
export async function getAlumnoByRutController(req, res) {
    try {
        const { rut } = req.params;
        const alumno = await findAlumnoByRut(rut);
        if (!alumno) {
            return handleErrorClient(res, 404, "Alumno no encontrado");
        }
        handleSuccess(res, 200, "Alumno encontrado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message, error);
    }
}

export async function updateAlumnoController(req, res) {
  try {
    const { rut } = req.params;
    const alumnoActualizado = await updateAlumno(rut, req.body);
    handleSuccess(res, 200, "Alumno actualizado correctamente", alumnoActualizado);
  } catch (error) {
    if (error.message === "Alumno no encontrado") {
      return handleErrorClient(res, 404, "Alumno no encontrado");
    }
    handleErrorServer(res, 500, error.message, error);
  }
}
export async function deleteAlumnoController(req, res) {
  try {
    const { rut } = req.params;
    await deleteAlumno(rut);
    handleSuccess(res, 200, "Alumno eliminado correctamente");
  } catch (error) {
    if (error.message === "Alumno no encontrado") {
      return handleErrorClient(res, 404, "Alumno no encontrado");
    }
    handleErrorServer(res, 500, error.message, error);
  }
}
