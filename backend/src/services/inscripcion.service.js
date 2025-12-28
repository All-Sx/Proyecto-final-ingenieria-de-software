import { AppDataSource } from "../config/configdb.js";
import { SolicitudInscripcion, CupoPorCarrera } from "../entities/inscripcion.entity.js";
import { Electivo } from "../entities/oferta.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Alumno } from "../entities/alumno.entity.js";
import { PeriodoAcademico } from "../entities/academico.entity.js";

export async function createSolicitudService(alumnoId, electivoId, prioridad) {
  try {
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

    // 1. Verificar que haya un periodo de inscripción activo
    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "INSCRIPCION" }
    });

    if (!periodoActivo) {
      return { error: "No hay un periodo de inscripción activo. Las inscripciones no están disponibles en este momento." };
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

    // 2. Verificar que el electivo exista y esté aprobado
    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
        return { error: "El electivo no existe." };
    }

    if (electivo.estado !== "APROBADO") {
        return { error: "El electivo no está disponible para inscripción. Debe estar aprobado." };
    }

    // 3. Verificar que el alumno exista (por seguridad)
    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
        return { error: "Alumno no encontrado." };
    }

    // 4. Obtener información del alumno incluyendo su carrera
    const alumnoInfo = await alumnoRepository.findOne({
        where: { usuario_id: alumnoId },
        relations: ["carrera"]
    });

    if (!alumnoInfo || !alumnoInfo.carrera) {
        return { error: "El alumno no tiene una carrera asignada. Contacta con administración." };
    }

    const carreraAlumno = alumnoInfo.carrera;

    console.log(`[DEBUG] Buscando cupos para: electivo_id=${electivoId}, carrera_id=${carreraAlumno.id}, carrera_nombre=${carreraAlumno.nombre}`);

    // 5. Obtener el cupo asignado para la carrera del alumno en este electivo
    const cupoCarrera = await cupoPorCarreraRepository
        .createQueryBuilder("cupo")
        .leftJoinAndSelect("cupo.electivo", "electivo")
        .leftJoinAndSelect("cupo.carrera", "carrera")
        .where("cupo.electivo_id = :electivoId", { electivoId })
        .andWhere("cupo.carrera_id = :carreraId", { carreraId: carreraAlumno.id })
        .getOne();

    console.log(`[DEBUG] Cupo encontrado:`, cupoCarrera);

    if (!cupoCarrera) {
        // Verificar si hay cupos para este electivo sin filtrar por carrera
        const todosCupos = await cupoPorCarreraRepository
            .createQueryBuilder("cupo")
            .leftJoinAndSelect("cupo.carrera", "carrera")
            .where("cupo.electivo_id = :electivoId", { electivoId })
            .getMany();
        
        console.log(`[DEBUG] Todos los cupos para este electivo:`, todosCupos.map(c => ({ 
            carrera_id: c.carrera?.id, 
            carrera_nombre: c.carrera?.nombre,
            cantidad: c.cantidad_reservada 
        })));
        
        return { error: `No hay cupos asignados para tu carrera (${carreraAlumno.nombre}) en este electivo.` };
    }

    // 6. Contar inscripciones ACEPTADAS y PENDIENTES de alumnos de esta carrera en este electivo
    // IMPORTANTE: Contamos PENDIENTES también porque están ocupando un cupo mientras se procesan
    // NO contamos LISTA_ESPERA ni RECHAZADAS porque no ocupan cupos
    const inscripcionesOcupadas = await solicitudRepository
        .createQueryBuilder("solicitud")
        .innerJoin("solicitud.alumno", "usuario")
        .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
        .innerJoin("alumno.carrera", "carrera")
        .where("solicitud.electivo_id = :electivoId", { electivoId })
        .andWhere("carrera.id = :carreraId", { carreraId: carreraAlumno.id })
        .andWhere("solicitud.estado IN (:...estados)", { estados: ["ACEPTADO", "PENDIENTE"] })
        .getCount();

    // 7. Verificar si ya existe una solicitud de este alumno para este electivo
    const solicitudExistente = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            electivo: { id: electivoId }
        }
    });

    if (solicitudExistente) {
        return { error: "Ya tienes una solicitud para este electivo." };
    }

    // 8. Determinar el estado inicial de la solicitud según disponibilidad de cupos
    let estadoInicial = "PENDIENTE";
    let mensajeResultado = "";

    if (inscripcionesOcupadas >= cupoCarrera.cantidad_reservada) {
        // NO hay cupos disponibles → Crear solicitud en LISTA_ESPERA
        estadoInicial = "LISTA_ESPERA";
        mensajeResultado = `No hay cupos disponibles. Tu solicitud quedó en LISTA DE ESPERA. Cupos: ${cupoCarrera.cantidad_reservada}, Ocupados: ${inscripcionesOcupadas}`;
        console.log(`[INSCRIPCIÓN - LISTA ESPERA] Alumno ${alumno.nombre_completo} (${carreraAlumno.nombre}) en lista de espera para "${electivo.nombre}". Cupos: ${inscripcionesOcupadas}/${cupoCarrera.cantidad_reservada}`);
    } else {
        // SÍ hay cupos disponibles → Crear solicitud en PENDIENTE
        mensajeResultado = `Solicitud enviada exitosamente. Cupos disponibles: ${cupoCarrera.cantidad_reservada - inscripcionesOcupadas - 1}/${cupoCarrera.cantidad_reservada}`;
        console.log(`[INSCRIPCIÓN - PENDIENTE] Alumno ${alumno.nombre_completo} (${carreraAlumno.nombre}) solicitó inscripción al electivo "${electivo.nombre}". Cupos disponibles: ${cupoCarrera.cantidad_reservada - inscripcionesOcupadas - 1}/${cupoCarrera.cantidad_reservada}`);
    }

    // 9. Crear la solicitud con el estado correspondiente
    const nuevaSolicitud = solicitudRepository.create({
        alumno: alumno,
        electivo: electivo,
        prioridad: prioridad || 1, 
        estado: estadoInicial,  // PENDIENTE o LISTA_ESPERA
        fecha_solicitud: new Date()
    });

    const solicitudGuardada = await solicitudRepository.save(nuevaSolicitud);
    
    // Crear respuesta limpia sin campos de auditoría
    const respuestaLimpia = {
        id: solicitudGuardada.id,
        prioridad: solicitudGuardada.prioridad,
        estado: solicitudGuardada.estado,
        fecha_solicitud: solicitudGuardada.fecha_solicitud,
        alumno: solicitudGuardada.alumno ? {
            id: solicitudGuardada.alumno.id,
            rut: solicitudGuardada.alumno.rut,
            email: solicitudGuardada.alumno.email,
            nombre_completo: solicitudGuardada.alumno.nombre_completo,
            activo: solicitudGuardada.alumno.activo
        } : null,
        electivo: solicitudGuardada.electivo ? {
            id: solicitudGuardada.electivo.id,
            nombre: solicitudGuardada.electivo.nombre,
            descripcion: solicitudGuardada.electivo.descripcion,
            creditos: solicitudGuardada.electivo.creditos,
            cupos: solicitudGuardada.electivo.cupos,
            estado: solicitudGuardada.electivo.estado,
            nombre_profesor: solicitudGuardada.electivo.nombre_profesor
        } : null
    };
    
    return { 
        data: respuestaLimpia,
        message: mensajeResultado 
    };

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

    // Limpiar respuesta eliminando campos de auditoría
    const solicitudesLimpias = solicitudes.map(solicitud => ({
      id: solicitud.id,
      prioridad: solicitud.prioridad,
      estado: solicitud.estado,
      fecha_solicitud: solicitud.fecha_solicitud,
      electivo: solicitud.electivo ? {
        id: solicitud.electivo.id,
        nombre: solicitud.electivo.nombre,
        descripcion: solicitud.electivo.descripcion,
        creditos: solicitud.electivo.creditos,
        cupos: solicitud.electivo.cupos,
        estado: solicitud.electivo.estado,
        nombre_profesor: solicitud.electivo.nombre_profesor
      } : null
    }));

    return { data: solicitudesLimpias };

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
