import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; // <--- Importamos desde oferta.entity.js
import { PeriodoAcademico, Carrera } from "../entities/academico.entity.js";
import { CupoPorCarrera } from "../entities/inscripcion.entity.js";

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
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);

    const electivo = await electivoRepository.findOneBy({ id: id });

    if (!electivo) {
      return { error: "Electivo no encontrado" };
    }

    // Guardar el estado anterior y cupos anteriores para detectar cambios
    const estadoAnterior = electivo.estado;
    const cuposAnteriores = electivo.cupos;

    // 2. Actualizar los campos que vengan en 'data'
    // Esto mezcla los datos antiguos con los nuevos
    electivoRepository.merge(electivo, data);

    
    const electivoActualizado = await electivoRepository.save(electivo);

    // 4. Si cambiaron los cupos y el electivo ya estaba APROBADO, actualizar la distribución
    if (estadoAnterior === "APROBADO" && cuposAnteriores !== electivoActualizado.cupos) {
      console.log(`[ACTUALIZACIÓN CUPOS] Los cupos del electivo "${electivoActualizado.nombre}" cambiaron de ${cuposAnteriores} a ${electivoActualizado.cupos}. Redistribuyendo...`);
      
      // Eliminar cupos anteriores
      await cupoPorCarreraRepository.delete({ electivo: { id: electivoActualizado.id } });
      
      // Reasignar con los nuevos cupos
      const resultadoCupos = await asignarCuposPorCarreraService(electivoActualizado.id);
      
      if (resultadoCupos.error) {
        console.error(`[ERROR] No se pudieron reasignar cupos: ${resultadoCupos.error}`);
        return { 
          error: `Cupos actualizados pero hubo un problema al redistribuir: ${resultadoCupos.error}` 
        };
      }
      
      console.log(`[ÉXITO] Cupos redistribuidos correctamente para el electivo "${electivoActualizado.nombre}"`);
    }

    // 5. Si el estado cambió a APROBADO, asignar cupos por carrera automáticamente
    if (estadoAnterior !== "APROBADO" && electivoActualizado.estado === "APROBADO") {
      console.log(`[APROBACIÓN] Electivo "${electivoActualizado.nombre}" fue aprobado. Asignando cupos por carrera...`);
      
      const resultadoCupos = await asignarCuposPorCarreraService(electivoActualizado.id);
      
      if (resultadoCupos.error) {
        // Si falla la asignación de cupos, registramos el error pero no revertimos la aprobación
        console.error(`[ERROR] No se pudieron asignar cupos: ${resultadoCupos.error}`);
        return { 
          error: `Electivo aprobado pero hubo un problema al asignar cupos: ${resultadoCupos.error}` 
        };
      }
      
      console.log(`[ÉXITO] Cupos asignados correctamente para el electivo "${electivoActualizado.nombre}"`);
    }

    return { data: electivoActualizado };

  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return { error: "Error interno al actualizar el electivo." };
  }
}

/**
 * Asigna cupos equitativamente entre las dos carreras para un electivo.
 * Divide los cupos totales del electivo en partes iguales entre las carreras.
 * Si los cupos son impares, la primera carrera recibe un cupo adicional.
 * 
 * @param {number} electivoId - ID del electivo al que se asignarán cupos
 * @returns {Object} { data: Array<CupoPorCarrera> } o { error: string }
 */
export async function asignarCuposPorCarreraService(electivoId) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);

    // 1. Verificar que el electivo exista
    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
      return { error: "Electivo no encontrado." };
    }

    // 2. Obtener todas las carreras (asumimos que solo hay 2)
    const carreras = await carreraRepository.find();
    
    if (carreras.length === 0) {
      return { error: "No hay carreras registradas en el sistema." };
    }

    if (carreras.length !== 2) {
      console.warn(`[ADVERTENCIA] Se esperaban 2 carreras, pero hay ${carreras.length}`);
    }

    // 3. Verificar si ya existen cupos asignados para este electivo
    const cuposExistentes = await cupoPorCarreraRepository.find({
      where: { electivo: { id: electivoId } }
    });

    if (cuposExistentes.length > 0) {
      return { error: "Este electivo ya tiene cupos asignados por carrera." };
    }

    // 4. Calcular la distribución equitativa de cupos
    const cuposTotales = electivo.cupos;
    const numCarreras = carreras.length;
    const cuposPorCarrera = Math.floor(cuposTotales / numCarreras);
    const cuposRestantes = cuposTotales % numCarreras;

    // 5. Crear los registros de cupos por carrera
    const cuposCreados = [];
    
    for (let i = 0; i < carreras.length; i++) {
      // Si hay cupos restantes (por ejemplo, 21 cupos / 2 = 10 con resto 1)
      // La primera carrera recibe el cupo extra
      const cantidad = cuposPorCarrera + (i < cuposRestantes ? 1 : 0);
      
      const nuevoCupo = cupoPorCarreraRepository.create({
        electivo: electivo,
        carrera: carreras[i],
        cantidad_reservada: cantidad
      });
      
      const cupoGuardado = await cupoPorCarreraRepository.save(nuevoCupo);
      cuposCreados.push(cupoGuardado);
      
      console.log(`[CUPOS] Asignados ${cantidad} cupos a ${carreras[i].nombre} para el electivo "${electivo.nombre}"`);
    }

    return { data: cuposCreados };

  } catch (error) {
    console.error("Error al asignar cupos por carrera:", error);
    return { error: "Error interno al asignar cupos por carrera." };
  }
}