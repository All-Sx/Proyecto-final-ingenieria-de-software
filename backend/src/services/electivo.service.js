import { AppDataSource } from "../config/configDB.js";
import { Electivo } from "../entities/electivo.entity.js";

const electivoRepository = AppDataSource.getRepository(Electivo);

export async function createElectivo(data) {
    const newElectivo = electivoRepository.create({
        codigo: data.codigo,
        nombre: data.nombre,
        rut_docente: data.rut_docente,
        creditos: data.creditos,
        semestre: data.semestre,
        descripcion: data.descripcion,
    });
    return await electivoRepository.save(newElectivo);
}
export async function findElectivoByCodigo(codigo) {
    return await electivoRepository.findOneBy({ codigo });
}
export async function updateElectivo(codigo, data) {
    try {
        const electivo = await electivoRepository.findOneBy({ codigo });
        await electivoRepository.update(electivo.codigo, electivo);
    } catch (error) {
        throw new Error("Electivo no encontrado", error);
    }
}
export async function deleteElectivo(codigo) {
    try {
        const electivo = await electivoRepository.findOneBy({ codigo });
        await electivoRepository.remove(electivo);
    } catch (error) {
        throw new Error("Electivo no encontrado", error);
    }
    return true;
}
export async function getAllElectivos() {
    return await electivoRepository.find();
}
