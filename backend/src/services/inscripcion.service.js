import { AppDataSource } from "../config/configdb.js";
import { SolicitudInscripcion, CupoPorCarrera } from "../entities/inscripcion.entity.js";
import { Electivo } from "../entities/oferta.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Alumno } from "../entities/alumno.entity.js";

export async function createSolicitudService(alumnoId, electivoId, prioridad) {
  try {
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);

    // 1. Verificar que el electivo exista y esté aprobado
    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
        return { error: "El electivo no existe." };
    }

    if (electivo.estado !== "APROBADO") {
        return { error: "El electivo no está disponible para inscripción. Debe estar aprobado." };
    }

    // 2. Verificar que el alumno exista (por seguridad)
    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
        return { error: "Alumno no encontrado." };
    }

    // 3. Obtener información del alumno incluyendo su carrera
    const alumnoInfo = await alumnoRepository.findOne({
        where: { usuario_id: alumnoId },
        relations: ["carrera"]
    });

    if (!alumnoInfo || !alumnoInfo.carrera) {
        return { error: "El alumno no tiene una carrera asignada. Contacta con administración." };
    }

    const carreraAlumno = alumnoInfo.carrera;

    // 4. Obtener el cupo asignado para la carrera del alumno en este electivo
    const cupoCarrera = await cupoPorCarreraRepository.findOne({
        where: {
            electivo: { id: electivoId },
            carrera: { id: carreraAlumno.id }
        }
    });

    if (!cupoCarrera) {
        return { error: `No hay cupos asignados para tu carrera (${carreraAlumno.nombre}) en este electivo.` };
    }

    // 5. Contar inscripciones ACEPTADAS y PENDIENTES de alumnos de esta carrera en este electivo
    // IMPORTANTE: Contamos PENDIENTES también porque están ocupando un cupo mientras se procesan
    const inscripcionesOcupadas = await solicitudRepository
        .createQueryBuilder("solicitud")
        .innerJoin("solicitud.alumno", "usuario")
        .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
        .innerJoin("alumno.carrera", "carrera")
        .where("solicitud.electivo_id = :electivoId", { electivoId })
        .andWhere("carrera.id = :carreraId", { carreraId: carreraAlumno.id })
        .andWhere("solicitud.estado IN (:...estados)", { estados: ["ACEPTADO", "PENDIENTE"] })
        .getCount();

    // 6. Validar que no se exceda el cupo asignado a la carrera
    if (inscripcionesOcupadas >= cupoCarrera.cantidad_reservada) {
        return { 
            error: `No hay cupos disponibles para tu carrera (${carreraAlumno.nombre}). Cupos: ${cupoCarrera.cantidad_reservada}, Ocupados: ${inscripcionesOcupadas}` 
        };
    }

    // 7. Verificar si ya existe una solicitud de este alumno para este electivo
    const solicitudExistente = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            electivo: { id: electivoId }
        }
    });

    if (solicitudExistente) {
        return { error: "Ya tienes una solicitud pendiente o aceptada para este electivo." };
    }

    // 8. Crear la solicitud
    // Nota: El estado se pone automáticamente en 'PENDIENTE' por la BD
    const nuevaSolicitud = solicitudRepository.create({
        alumno: alumno,
        electivo: electivo,
        prioridad: prioridad || 1, 
        fecha_solicitud: new Date()
    });

    const solicitudGuardada = await solicitudRepository.save(nuevaSolicitud);
    
    console.log(`[INSCRIPCIÓN] Alumno ${alumno.nombre_completo} (${carreraAlumno.nombre}) solicitó inscripción al electivo "${electivo.nombre}". Cupos disponibles: ${cupoCarrera.cantidad_reservada - inscripcionesOcupadas - 1}/${cupoCarrera.cantidad_reservada}`);
    
    return { data: solicitudGuardada };

  } catch (error) {
    console.error("Error al crear solicitud:", error);
    return { error: "Error interno al procesar la inscripción." };
  }
}

export async function getSolicitudesPorAlumnoService(alumnoId) {
  try {
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);

    const solicitudes = await solicitudRepository.find({
      where: {
        alumno: { id: alumnoId } 
      },
      relations: ["electivo"], 
      order: {
        fecha_solicitud: "DESC" 
      }
    });

    return { data: solicitudes };

  } catch (error) {
    console.error("Error al obtener solicitudes del alumno:", error);
    return { error: "Error interno al obtener tus solicitudes." };
  }
}

/**
 * Obtiene los cupos disponibles por carrera para un electivo específico.
 * Muestra cupos totales, cupos ocupados y cupos disponibles por cada carrera.
 * 
 * @param {number} electivoId - ID del electivo a consultar
 * @returns {Object} { data: Array<{ carrera, cuposReservados, cuposOcupados, cuposDisponibles }> } o { error: string }
 */
export async function getCuposPorCarreraService(electivoId) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);

    // 1. Verificar que el electivo exista
    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
      return { error: "El electivo no existe." };
    }

    // 2. Obtener todos los cupos asignados por carrera para este electivo
    const cuposPorCarrera = await cupoPorCarreraRepository.find({
      where: { electivo: { id: electivoId } },
      relations: ["carrera"]
    });

    if (cuposPorCarrera.length === 0) {
      return { error: "Este electivo no tiene cupos asignados por carrera. Debe ser aprobado primero." };
    }

    // 3. Para cada carrera, calcular cupos ocupados y disponibles
    const resultados = [];

    for (const cupoCarrera of cuposPorCarrera) {
      const carrera = cupoCarrera.carrera;

      // Contar inscripciones ACEPTADAS de esta carrera en este electivo
      const cuposOcupados = await solicitudRepository
        .createQueryBuilder("solicitud")
        .innerJoin("solicitud.alumno", "usuario")
        .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
        .innerJoin("alumno.carrera", "carrera")
        .where("solicitud.electivo_id = :electivoId", { electivoId })
        .andWhere("carrera.id = :carreraId", { carreraId: carrera.id })
        .andWhere("solicitud.estado = :estado", { estado: "ACEPTADO" })
        .getCount();

      const cuposDisponibles = cupoCarrera.cantidad_reservada - cuposOcupados;

      resultados.push({
        carrera: {
          id: carrera.id,
          codigo: carrera.codigo,
          nombre: carrera.nombre
        },
        cuposReservados: cupoCarrera.cantidad_reservada,
        cuposOcupados: cuposOcupados,
        cuposDisponibles: cuposDisponibles
      });
    }

    return { data: resultados };

  } catch (error) {
    console.error("Error al obtener cupos por carrera:", error);
    return { error: "Error interno al consultar cupos por carrera." };
  }
}
