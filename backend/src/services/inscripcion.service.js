import { AppDataSource } from "../config/configdb.js";
import { SolicitudInscripcion } from "../entities/inscripcion.entity.js";
import { Electivo } from "../entities/oferta.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";

export async function createSolicitudService(alumnoId, electivoId, prioridad) {
  try {
    const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // 1. Verificar que el electivo exista
    const electivo = await electivoRepository.findOneBy({ id: electivoId });
    if (!electivo) {
        return { error: "El electivo no existe." };
    }

    // 2. Verificar que el alumno exista (por seguridad)
    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
        return { error: "Alumno no encontrado." };
    }

    // 3. Verificar si ya existe una solicitud de este alumno para este electivo
    const solicitudExistente = await solicitudRepository.findOne({
        where: {
            alumno: { id: alumnoId },
            electivo: { id: electivoId }
        }
    });

    if (solicitudExistente) {
        return { error: "Ya tienes una solicitud pendiente o aceptada para este electivo." };
    }

    // 4. Crear la solicitud
    // Nota: El estado se pone automáticamente en 'PENDIENTE' por la BD
    const nuevaSolicitud = solicitudRepository.create({
        alumno: alumno,
        electivo: electivo,
        prioridad: prioridad || 1, // Si no envía prioridad, asumimos 1
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
        alumno: { id: alumnoId } // Filtramos por el alumno logueado
      },
      relations: ["electivo"], // ¡Importante! Para ver los datos del ramo
      order: {
        fecha_solicitud: "DESC" // Las más recientes primero
      }
    });

    return { data: solicitudes };

  } catch (error) {
    console.error("Error al obtener solicitudes del alumno:", error);
    return { error: "Error interno al obtener tus solicitudes." };
  }
}