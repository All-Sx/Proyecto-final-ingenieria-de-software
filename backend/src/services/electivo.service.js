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

// Aprobar un electivo (Jefe de Carrera)
export async function aprobarElectivoService(id) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    
    // 1. Buscar el electivo
    const electivo = await electivoRepository.findOneBy({ id });
    if (!electivo) {
      return { error: "Electivo no encontrado." };
    }

    // 2. Validar que no esté ya aprobado
    if (electivo.estado === "Aprobado") {
      return { error: "El electivo ya está aprobado." };
    }

    // 3. Validar que no esté rechazado (no se puede cambiar de decisión)
    if (electivo.estado === "Rechazado") {
      return { error: "No se puede aprobar un electivo que ya fue rechazado." };
    }

    // 4. Cambiar estado a "Aprobado"
    electivo.estado = "Aprobado";
    await electivoRepository.save(electivo);
    
    return { data: electivo };

  } catch (error) {
    console.error("Error en aprobarElectivoService:", error);
    return { error: "Error interno al aprobar el electivo." };
  }
}

// Rechazar un electivo (Jefe de Carrera)
export async function rechazarElectivoService(id) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    
    // 1. Buscar el electivo
    const electivo = await electivoRepository.findOneBy({ id });
    if (!electivo) {
      return { error: "Electivo no encontrado." };
    }

    // 2. Validar que no esté ya rechazado
    if (electivo.estado === "Rechazado") {
      return { error: "El electivo ya está rechazado." };
    }

    // 3. Validar que no esté aprobado (no se puede cambiar de decisión)
    if (electivo.estado === "Aprobado") {
      return { error: "No se puede rechazar un electivo que ya fue aprobado." };
    }

    // 4. Cambiar estado a "Rechazado"
    electivo.estado = "Rechazado";
    await electivoRepository.save(electivo);
    
    return { data: electivo };

  } catch (error) {
    console.error("Error en rechazarElectivoService:", error);
    return { error: "Error interno al rechazar el electivo." };
  }
}