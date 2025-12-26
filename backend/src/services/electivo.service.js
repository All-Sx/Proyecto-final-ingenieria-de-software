import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; // <--- Importamos desde oferta.entity.js
import { PeriodoAcademico } from "../entities/academico.entity.js";

export async function createElectivoService(data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

    // Validar que exista un periodo en estado INSCRIPCION
    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "INSCRIPCION" }
    });

    if (!periodoActivo) {
      return { error: "No hay un periodo de inscripción activo. Debe crear o activar un periodo primero." };
    }

    // Validar que estamos dentro de las fechas del periodo
    const ahora = new Date();
    const fechaInicio = new Date(periodoActivo.fecha_inicio);
    const fechaFin = new Date(periodoActivo.fecha_fin);

    if (ahora < fechaInicio) {
      return { error: `El periodo de inscripción aún no ha iniciado. Comienza el ${fechaInicio.toLocaleDateString()}.` };
    }

    if (ahora > fechaFin) {
      return { error: `El periodo de inscripción ha finalizado. Terminó el ${fechaFin.toLocaleDateString()}.` };
    }

    //validar si el nombre ya existe
    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }

    // Crear el electivo
    // Importante: El estado siempre se fuerza a "PENDIENTE" sin importar lo que venga en data
    // Esto asegura que todos los electivos necesiten aprobación del jefe de carrera
    const nuevoElectivo = electivoRepository.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos || 5, // Usar 5 por defecto si no envia nada es lo creditos minimos de la malla
        cupos: data.cupos,
        estado: "PENDIENTE" // ⬅️ Siempre inicia en PENDIENTE, solo el jefe puede APROBA o RECHAZAR
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

export async function updateElectivoService(id, data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);

    // 1. Buscar si el electivo existe
    const electivo = await electivoRepository.findOneBy({ id: id });

    if (!electivo) {
      return { error: "Electivo no encontrado" };
    }

    // 2. Actualizar los campos que vengan en 'data'
    // Esto mezcla los datos antiguos con los nuevos
    electivoRepository.merge(electivo, data);

    // 3. Guardar cambios
    const electivoActualizado = await electivoRepository.save(electivo);

    return { data: electivoActualizado };

  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return { error: "Error interno al actualizar el electivo." };
  }
}