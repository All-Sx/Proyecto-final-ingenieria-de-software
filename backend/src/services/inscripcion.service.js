import { AppDataSource } from "../config/configdb.js";
import { SolicitudInscripcion } from "../entities/inscripcion.entity.js";
import { Electivo } from "../entities/oferta.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";

export async function createSolicitudService(alumnoId, electivoId, prioridad) {
  try {
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
        return { error: "El electivo no existe." };
    }

    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
        return { error: "Alumno no encontrado." };
    }

    const solicitudExistente = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            electivo: { id: electivoId }
        }
    });

    if (solicitudExistente) {
        return { error: "Ya tienes una solicitud pendiente o aceptada para este electivo." };
    }

    const nuevaSolicitud = solicitudRepository.create({
        alumno: alumno,
        electivo: electivo,
        prioridad: prioridad || 1, 
        fecha_solicitud: new Date()
    });

    const solicitudGuardada = await solicitudRepository.save(nuevaSolicitud);
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
