import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; //Importamos desde oferta.entity.js

export async function createElectivoService(data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);

    // 1. Validar si ya existe el nombre
    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }

    // 2. Crear el electivo
    const nuevoElectivo = electivoRepository.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos || 5, // Usamos 5 por defecto si no envían nada
        cupos: data.cupos
    });

    const electivoGuardado = await electivoRepository.save(nuevoElectivo);
    return { data: electivoGuardado };

  } catch (error) {
    console.error("Error en createElectivoService:", error);
    return { error: "Error interno al crear el electivo." };
  }
}

// Obtener todos los electivos 
export async function getAllElectivosService() {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    
    // Obtener TODOS los electivos ordenados por fecha de creación (más recientes primero)
    const electivos = await electivoRepository.find({
      order: { created_at: "DESC" }
    });
    
    return { data: electivos };

  } catch (error) {
    console.error("Error en getAllElectivosService:", error);
    return { error: "Error interno al obtener los electivos." };
  }
}