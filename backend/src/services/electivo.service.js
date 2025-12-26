import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; 
import { PeriodoAcademico } from "../entities/academico.entity.js";

export async function createElectivoService(data, nombreProfesor) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "INSCRIPCION" }
    });

    if (!periodoActivo) {
      return { error: "No hay un periodo de inscripción activo. Debe crear o activar un periodo primero." };
    }

    const ahora = new Date();
    const fechaInicio = new Date(periodoActivo.fecha_inicio);
    const fechaFin = new Date(periodoActivo.fecha_fin);

    if (ahora < fechaInicio) {
      return { error: `El periodo de inscripción aún no ha iniciado. Comienza el ${fechaInicio.toLocaleDateString()}.` };
    }

    if (ahora > fechaFin) {
      return { error: `El periodo de inscripción ha finalizado. Terminó el ${fechaFin.toLocaleDateString()}.` };
    }

    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }

    const nuevoElectivo = electivoRepository.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos || 5, 
        cupos: data.cupos,
        estado: "PENDIENTE", 
        nombre_profesor: nombreProfesor 
    });

    const electivoGuardado = await electivoRepository.save(nuevoElectivo);
    return { data: electivoGuardado };

  } catch (error) {
    console.error("Error en createElectivoService:", error);
    return { error: "Error interno al crear el electivo." };
  }
}

export async function getElectivosService() {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    
    const electivos = await electivoRepository.find();

    return { data: electivos };
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    return { error: "Error interno al listar los electivos." };
  }
}

export async function getElectivosByProfesorService(nombreProfesor) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    
    const electivos = await electivoRepository.find({
      where: { nombre_profesor: nombreProfesor } 
    });

    return { data: electivos };
  } catch (error) {
    console.error("Error al obtener electivos del profesor:", error);
    return { error: "Error interno al listar los electivos del profesor." };
  }
}

export async function updateElectivoService(id, data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);

    const electivo = await electivoRepository.findOneBy({ id: id });

    if (!electivo) {
      return { error: "Electivo no encontrado" };
    }

    
    electivoRepository.merge(electivo, data);

    
    const electivoActualizado = await electivoRepository.save(electivo);

    return { data: electivoActualizado };

  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return { error: "Error interno al actualizar el electivo." };
  }
}