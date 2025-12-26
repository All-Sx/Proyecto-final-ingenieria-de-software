import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; // <--- Importamos desde oferta.entity.js

export async function createElectivoService(data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);

    //validar si el nombre ya existe
    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }

    //crear el electivo
    const nuevoElectivo = electivoRepository.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos || 5, //usar 5 por defecto si no envia nada
        cupos: data.cupos
    });

    const electivoGuardado = await electivoRepository.save(nuevoElectivo);
    return { data: electivoGuardado };

  } catch (error) {
    console.error("Error en createElectivoService:", error);
    return { error: "Error interno al crear el electivo." };
  }
}