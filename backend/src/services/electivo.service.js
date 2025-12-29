import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js";
import { PeriodoAcademico, Carrera } from "../entities/academico.entity.js";
import { CupoPorCarrera } from "../entities/inscripcion.entity.js";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export async function createElectivoService(data, nombreProfesor) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);

    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "PLANIFICACION" }
    });

    if (!periodoActivo) {
      return { error: "No hay un periodo de planificación activo. Debe crear o activar un periodo primero." };
    }

    const ahora = new Date();
    const fechaInicio = new Date(periodoActivo.fecha_inicio);
    const fechaFin = new Date(periodoActivo.fecha_fin);

    if (ahora < fechaInicio) {
      return { error: `El periodo de planificación aún no ha iniciado. Comienza el ${fechaInicio.toLocaleDateString()}.` };
    }

    if (ahora > fechaFin) {
      return { error: `El periodo de planificación ha finalizado. Terminó el ${fechaFin.toLocaleDateString()}.` };
    }

    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }
    
    // El frontend DEBE enviar distribucion_cupos con los cupos por carrera
    // Ejemplo: [{ carrera_id: 1, cantidad: 50 }, { carrera_id: 2, cantidad: 10 }]
    if (!data.distribucion_cupos || !Array.isArray(data.distribucion_cupos) || data.distribucion_cupos.length === 0) {
      return { error: "Debe especificar la distribución de cupos por carrera." };
    }

    // Sumar todos los cupos de la distribución (50 + 10 = 60)
    const sumaDistribucion = data.distribucion_cupos.reduce((sum, item) => sum + (item.cantidad || 0), 0);

    // Verificar que la suma sea igual al total de cupos
    // Si el total es 60, la suma debe ser 60 (50+10 o 30+30 o lo que sea)
    if (sumaDistribucion !== data.cupos) {
      return { error: `La suma de la distribución (${sumaDistribucion}) no coincide con los cupos totales (${data.cupos}).` };
    }

    // Verificar que cada carrera exista en la BD y tenga cantidad válida
    for (const item of data.distribucion_cupos) {
      if (!item.carrera_id || item.cantidad <= 0) {
        return { error: "Cada carrera debe tener un ID válido y cantidad mayor a 0." };
      }
      
      const carreraExiste = await carreraRepository.findOneBy({ id: item.carrera_id });
      if (!carreraExiste) {
        return { error: `La carrera con ID ${item.carrera_id} no existe.` };
      }
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

  
    // guardamos los cupos en la tabla CupoPorCarrera
    // Se hace al crear el electivo (manual según lo que envió el profesor)
    const cuposCreados = [];
    for (const item of data.distribucion_cupos) {
      const carrera = await carreraRepository.findOneBy({ id: item.carrera_id });
      
      // Crear registro en la tabla cupos_por_carrera
      const nuevoCupo = cupoPorCarreraRepository.create({
        electivo: electivoGuardado,
        carrera: carrera,
        cantidad_reservada: item.cantidad // La cantidad que definió el profesor
      });
      
      const cupoGuardado = await cupoPorCarreraRepository.save(nuevoCupo);
      cuposCreados.push({
        carrera_id: carrera.id,
        carrera_nombre: carrera.nombre,
        cantidad: cupoGuardado.cantidad_reservada
      });
      
      console.log(`[CUPOS] Asignados ${item.cantidad} cupos a ${carrera.nombre} para el electivo "${electivoGuardado.nombre}"`);
    }

    return { 
      data: {
        id: electivoGuardado.id,
        nombre: electivoGuardado.nombre,
        descripcion: electivoGuardado.descripcion,
        creditos: electivoGuardado.creditos,
        cupos: electivoGuardado.cupos,
        estado: electivoGuardado.estado,
        nombre_profesor: electivoGuardado.nombre_profesor,
        distribucion_cupos: cuposCreados
      }
    };

  } catch (error) {
    console.error("Error en createElectivoService:", error);
    return { error: "Error interno al crear el electivo." };
  }
}

export async function getElectivosService(estado) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
    
    const filtro = estado ? { estado: estado } : {};

    const electivos = await electivoRepository.find({
      where: filtro
    });

    // Para cada electivo, obtener su distribución de cupos
    const electivosConCupos = await Promise.all(electivos.map(async (e) => {
      const cuposPorCarrera = await cupoPorCarreraRepository.find({
        where: { electivo: { id: e.id } },
        relations: ['carrera']
      });

      const distribucion_cupos = cuposPorCarrera.map(c => ({
        carrera_id: c.carrera.id,
        carrera_nombre: c.carrera.nombre,
        cantidad: c.cantidad_reservada
      }));

      return {
        id: e.id,
        nombre: e.nombre,
        descripcion: e.descripcion,
        creditos: e.creditos,
        cupos: e.cupos,
        estado: e.estado,
        nombre_profesor: e.nombre_profesor,
        distribucion_cupos: distribucion_cupos
      };
    }));

    return { data: electivosConCupos };
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

    const electivosLimpios = electivos.map(e => ({
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion,
      creditos: e.creditos,
      cupos: e.cupos,
      estado: e.estado,
      nombre_profesor: e.nombre_profesor
    }));

    return { data: electivosLimpios };
  } catch (error) {
    console.error("Error al obtener electivos del profesor:", error);
    return { error: "Error interno al listar los electivos del profesor." };
  }
}

export async function updateElectivoService(id, data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);

    const electivo = await electivoRepository.findOneBy({ id: id });

    if (!electivo) {
      return { error: "Electivo no encontrado" };
    }

    const estadoAnterior = electivo.estado;

  
    if (data.distribucion_cupos && Array.isArray(data.distribucion_cupos)) {
      
      const sumaDistribucion = data.distribucion_cupos.reduce((sum, item) => sum + (item.cantidad || 0), 0);
      
      if (data.cupos && sumaDistribucion !== data.cupos) {
        return { error: `La suma de la distribución (${sumaDistribucion}) no coincide con los cupos totales (${data.cupos}).` };
      }
      
      if (!data.cupos) {
        data.cupos = sumaDistribucion;
      }
      
      for (const item of data.distribucion_cupos) {
        if (!item.carrera_id || item.cantidad < 0) {
          return { error: "Cada carrera debe tener un ID válido y cantidad mayor o igual a 0." };
        }
        
        const carreraExiste = await carreraRepository.findOneBy({ id: item.carrera_id });
        if (!carreraExiste) {
          return { error: `La carrera con ID ${item.carrera_id} no existe.` };
        }
      }
      
      await cupoPorCarreraRepository.delete({ electivo: { id: electivo.id } });
      
      for (const item of data.distribucion_cupos) {
        const carrera = await carreraRepository.findOneBy({ id: item.carrera_id });
        
        const nuevoCupo = cupoPorCarreraRepository.create({
          electivo: electivo,
          carrera: carrera,
          cantidad_reservada: item.cantidad
        });
        
        await cupoPorCarreraRepository.save(nuevoCupo);
        console.log(`[ACTUALIZACIÓN] ${item.cantidad} cupos asignados a ${carrera.nombre}`);
      }
    }

    electivoRepository.merge(electivo, data);
    const electivoActualizado = await electivoRepository.save(electivo);

    if (estadoAnterior !== "APROBADO" && electivoActualizado.estado === "APROBADO") {
      console.log(`[APROBACIÓN] Verificando cupos para el electivo "${electivoActualizado.nombre}"...`);
      
      const cuposExistentes = await cupoPorCarreraRepository.find({
        where: { electivo: { id: electivoActualizado.id } }
      });
      
      if (cuposExistentes.length === 0) {
        return { error: "No se puede aprobar el electivo porque no tiene cupos asignados por carrera." };
      }
      
      console.log(`[ÉXITO] Electivo aprobado con distribución de cupos existente.`);
    }

    return { 
      data: {
        id: electivoActualizado.id,
        nombre: electivoActualizado.nombre,
        descripcion: electivoActualizado.descripcion,
        creditos: electivoActualizado.creditos,
        cupos: electivoActualizado.cupos,
        estado: electivoActualizado.estado,
        nombre_profesor: electivoActualizado.nombre_profesor
      } 
    };

  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return { error: "Error interno al actualizar el electivo." };
  }
}


export async function getElectivosAprobadosService() {
  try {
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);
    const electivoRepository = AppDataSource.getRepository(Electivo);

    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "INSCRIPCION" }
    });

    if (!periodoActivo) {
      return { 
        error: "No hay un periodo de inscripción activo. No se pueden ver los electivos en este momento." 
      };
    }

    const electivosAprobados = await electivoRepository.find({
      where: { estado: "APROBADO" },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        creditos: true,
        cupos: true,
        estado: true,
        nombre_profesor: true
      }
    });

    return { data: electivosAprobados };

  } catch (error) {
    console.error("Error al obtener electivos aprobados:", error);
    return { error: "Error interno al obtener electivos aprobados." };
  }
}