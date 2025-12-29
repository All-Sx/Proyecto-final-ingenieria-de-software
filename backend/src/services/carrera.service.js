import { AppDataSource } from "../config/configdb.js";
import { Carrera } from "../entities/academico.entity.js"; 

export async function createCarreraService(data) {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);

    const carreraExist = await carreraRepository.findOne({
      where: [
        { codigo: data.codigo },
        { nombre: data.nombre }
      ]
    });

    if (carreraExist) {
      return { error: "Ya existe una carrera con ese código o nombre." };
    }

    const nuevaCarrera = carreraRepository.create({
      codigo: data.codigo,
      nombre: data.nombre
    });

    const carreraGuardada = await carreraRepository.save(nuevaCarrera);
    
    const respuestaLimpia = {
      id: carreraGuardada.id,
      codigo: carreraGuardada.codigo,
      nombre: carreraGuardada.nombre
    };
    
    return { data: respuestaLimpia };

  } catch (error) {
    console.error("Error al crear carrera:", error);
    return { error: "Error interno al crear la carrera." };
  }
}

export async function getAllCarrerasService() {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const carreras = await carreraRepository.find();
    
    const carrerasLimpias = carreras.map(c => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre
    }));
    
    return { data: carrerasLimpias };
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return { error: "Error interno al obtener las carreras." };
  }
}