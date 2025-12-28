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

    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
        return { error: "El electivo no existe." };
    }

    if (electivo.estado !== "APROBADO") {
        return { error: "El electivo no está disponible para inscripción. Debe estar aprobado." };
    }

    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
        return { error: "Alumno no encontrado." };
    }

    const alumnoInfo = await alumnoRepository.findOne({
        where: { usuario_id: alumnoId },
        relations: ["carrera"]
    });

    if (!alumnoInfo || !alumnoInfo.carrera) {
        return { error: "El alumno no tiene una carrera asignada. Contacta con administración." };
    }

    const carreraAlumno = alumnoInfo.carrera;

    console.log(`[DEBUG] Buscando cupos para: electivo_id=${electivoId}, carrera_id=${carreraAlumno.id}, carrera_nombre=${carreraAlumno.nombre}`);

    const cupoCarrera = await cupoPorCarreraRepository
        .createQueryBuilder("cupo")
        .leftJoinAndSelect("cupo.electivo", "electivo")
        .leftJoinAndSelect("cupo.carrera", "carrera")
        .where("cupo.electivo_id = :electivoId", { electivoId })
        .andWhere("cupo.carrera_id = :carreraId", { carreraId: carreraAlumno.id })
        .getOne();

    console.log(`[DEBUG] Cupo encontrado:`, cupoCarrera);

    if (!cupoCarrera) {
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

   
    const inscripcionesOcupadas = await solicitudRepository
        .createQueryBuilder("solicitud")
        .innerJoin("solicitud.alumno", "usuario")
        .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
        .innerJoin("alumno.carrera", "carrera")
        .where("solicitud.electivo_id = :electivoId", { electivoId })
        .andWhere("carrera.id = :carreraId", { carreraId: carreraAlumno.id })
        .andWhere("solicitud.estado IN (:...estados)", { estados: ["ACEPTADO", "PENDIENTE"] })
        .getCount();

    const solicitudExistente = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            electivo: { id: electivoId }
        }
    });

    if (solicitudExistente) {
        return { error: "Ya tienes una solicitud para este electivo." };
    }

    if (!prioridad || prioridad < 1) {
        return { error: "Debes especificar una prioridad válida (número entero mayor o igual a 1)." };
    }

    const electivosAprobados = await electivoRepository.count({
        where: { estado: "APROBADO" }
    });

    if (electivosAprobados === 0) {
        return { error: "No hay electivos aprobados disponibles para inscripción." };
    }

    if (prioridad > electivosAprobados) {
        return { error: `La prioridad no puede ser mayor a ${electivosAprobados} (número de electivos disponibles).` };
    }

    const solicitudConMismaPrioridad = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            prioridad: prioridad
        }
    });

    if (solicitudConMismaPrioridad) {
        return { error: `Ya tienes una solicitud con prioridad ${prioridad}. Cada electivo debe tener una prioridad diferente.` };
    }

    let estadoInicial = "PENDIENTE";
    let mensajeResultado = "";

    if (inscripcionesOcupadas >= cupoCarrera.cantidad_reservada) {
        estadoInicial = "LISTA_ESPERA";
        mensajeResultado = `No hay cupos disponibles. Tu solicitud quedó en LISTA DE ESPERA. Cupos: ${cupoCarrera.cantidad_reservada}, Ocupados: ${inscripcionesOcupadas}`;
        console.log(`[INSCRIPCIÓN - LISTA ESPERA] Alumno ${alumno.nombre_completo} (${carreraAlumno.nombre}) en lista de espera para "${electivo.nombre}". Cupos: ${inscripcionesOcupadas}/${cupoCarrera.cantidad_reservada}`);
    } else {
        mensajeResultado = `Solicitud enviada exitosamente. Cupos disponibles: ${cupoCarrera.cantidad_reservada - inscripcionesOcupadas - 1}/${cupoCarrera.cantidad_reservada}`;
        console.log(`[INSCRIPCIÓN - PENDIENTE] Alumno ${alumno.nombre_completo} (${carreraAlumno.nombre}) solicitó inscripción al electivo "${electivo.nombre}". Cupos disponibles: ${cupoCarrera.cantidad_reservada - inscripcionesOcupadas - 1}/${cupoCarrera.cantidad_reservada}`);
    }

    const nuevaSolicitud = solicitudRepository.create({
        alumno: alumno,
        electivo: electivo,
        prioridad: prioridad, 
        estado: estadoInicial,  
        fecha_solicitud: new Date()
    });

    const solicitudGuardada = await solicitudRepository.save(nuevaSolicitud);
    
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


export async function getCuposPorCarreraService(electivoId) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);

    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
      return { error: "El electivo no existe." };
    }

    const cuposPorCarrera = await cupoPorCarreraRepository.find({
      where: { electivo: { id: electivoId } },
      relations: ["carrera"]
    });

    if (cuposPorCarrera.length === 0) {
      return { error: "Este electivo no tiene cupos asignados por carrera. Debe ser aprobado primero." };
    }

    const resultados = [];

    for (const cupoCarrera of cuposPorCarrera) {
      const carrera = cupoCarrera.carrera;

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
