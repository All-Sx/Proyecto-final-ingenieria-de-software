import { AppDataSource } from "../config/configdb.js";
import { Alumno } from "../entities/alumno.entity.js";

const alumnoRepository = AppDataSource.getRepository(Alumno);

export async function createAlumno(data) {

    const newAlumno = alumnoRepository.create({
        rut: data.rut,
        carrera: data.carrera,
        ingreso: data.ingreso,
        creditos_aprovados: data.creditos_aprovados,

    });

    return await alumnoRepository.save(newAlumno);
}
export async function findAlumnoByRut(rut) {
    return await alumnoRepository.findOneBy({ rut });
}
export async function updateAlumno(rut, data) {
    try {
        const alumno = await alumnoRepository.findOneBy({ rut });
        await alumnoRepository.update(alumno.rut, alumno);
    } catch (error) {
        throw new Error("Alumno no encontrado", error);
    }
}

export async function deleteAlumno(rut) {
    try {
        const alumno = await alumnoRepository.findOneBy({ rut });
        await alumnoRepository.remove(alumno);
    } catch (error) {
        throw new Error("Alumno no encontrado", error);
    }
    return true;
}
export async function getAllAlumnos() {
    return await alumnoRepository.find();
}