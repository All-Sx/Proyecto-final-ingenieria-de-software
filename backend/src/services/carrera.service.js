import { Carrera } from "../entities/carrera.entity.js";
import { AppDataSource } from "../config/configDB.js";

const carreraRepository = AppDataSource.getRepository(Carrera);

export async function createCarrera(data) {
    const newCarrera = carreraRepository.create({
        codigo: data.codigo,
        nombre: data.nombre,
        duracion: data.duracion,
        titulo: data.titulo,
    });
    return await carreraRepository.save(newCarrera);
}
export async function findCarreraByCodigo(codigo) {
    return await carreraRepository.findOneBy({ codigo });
}
export async function updateCarrera(codigo, data) {
    try {
        const carrera = await carreraRepository.findOneBy({ codigo });
        await carreraRepository.update(carrera.codigo, data);
    } catch (error) {
        throw new Error("Carrera no encontrada", error);
    }
}
export async function deleteCarrera(codigo) {
    try {
        const carrera = await carreraRepository.findOneBy({ codigo });
        await carreraRepository.remove(carrera);
    } catch (error) {
        throw new Error("Carrera no encontrada", error);
    }
    return true;
}
export async function getAllCarreras() {
    return await carreraRepository.find();
}
