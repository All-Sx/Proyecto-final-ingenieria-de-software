import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js"; 
import { Rol } from "../entities/rol.entity.js";
import { Carrera } from "../entities/academico.entity.js";
import { SolicitudInscripcion, CupoPorCarrera } from "../entities/inscripcion.entity.js";
import { Alumno } from "../entities/alumno.entity.js";
import bcrypt from "bcrypt";

const usuarioRepository = AppDataSource.getRepository(Usuario);
const rolRepository = AppDataSource.getRepository(Rol);

export async function createJefeCarreraService(data) {
    const existingUser = await usuarioRepository.findOne({
        where: [{ rut: data.rut }, { email: data.email }]
    });

    if (existingUser) {
        throw new Error("El usuario ya existe con ese RUT o Email.");
    }

    // Contar jefes de carrera existentes
    const jefesExistentes = await usuarioRepository.count({
        where: { rol: { nombre: "Jefe de Carrera" } }
    });

    // Limitar a máximo 3 jefes de carrera
    if (jefesExistentes >= 3) {
        throw new Error("Ya existen 3 Jefes de Carrera. No se pueden crear más.");
    }

    // Si NO es el primer jefe, carrera_id es OBLIGATORIO
    if (jefesExistentes > 0 && !data.carrera_id) {
        throw new Error("El campo carrera_id es obligatorio para nuevos jefes de carrera.");
    }

    // Si se proporciona carrera_id, validar que exista
    let carreraAsignada = null;
    if (data.carrera_id) {
        const carreraRepository = AppDataSource.getRepository(Carrera);
        carreraAsignada = await carreraRepository.findOneBy({ id: data.carrera_id });
        
        if (!carreraAsignada) {
            throw new Error("La carrera especificada no existe.");
        }

        // Verificar que no haya otro jefe con la misma carrera
        const jefeConCarrera = await usuarioRepository.findOne({
            where: { 
                rol: { nombre: "Jefe de Carrera" },
                carrera: { id: data.carrera_id }
            }
        });

        if (jefeConCarrera) {
            throw new Error(`Ya existe un Jefe de Carrera asignado a ${carreraAsignada.nombre}.`);
        }
    }

    const rolJefe = await rolRepository.findOneBy({ nombre: "Jefe de Carrera" });

    if (!rolJefe) {
        throw new Error("El rol 'Jefe de Carrera' no existe en la base de datos.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newJefe = usuarioRepository.create({
        rut: data.rut,
        nombre_completo: data.nombre_completo,
        email: data.email,
        password_hash: hashedPassword,
        rol: rolJefe,
        carrera: carreraAsignada,
        activo: true
    });

    const savedUser = await usuarioRepository.save(newJefe);
    const { password_hash, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
}

export async function findAllJefesService() {
    return await usuarioRepository.find({
        where: {
            rol: { nombre: "Jefe de Carrera" }
        },
        relations: ["rol", "carrera"], 
        select: {
            id: true,
            rut: true,
            email: true,
            nombre_completo: true,
            activo: true
        }
    });
}

export async function findJefeByRutService(rut) {
    return await usuarioRepository.findOne({
        where: {
            rut: rut,
            rol: { nombre: "Jefe de Carrera" } 
        },
        relations: ["rol"]
    });
}

export async function deleteUsuarioDeAlumnoByRutService(rut) {

    const existingUser = await usuarioRepository.findOneBy({ rut: rut, rol: 3 });

    if (!existingUser) throw new Error("No existe alumno con ese RUT.");

    return await usuarioRepository.remove(existingUser);

}

export async function getSolicitudesPorCarreraService(jefeId, filtros = {}) {
    try {
        const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        
        // Obtener información del jefe autenticado
        const jefe = await usuarioRepository.findOne({
            where: { id: jefeId },
            relations: ["carrera"]
        });
        
        if (!jefe) {
            return { error: "Jefe de carrera no encontrado" };
        }
        
        // Construir query base
        const query = solicitudRepository
            .createQueryBuilder("solicitud")
            .leftJoinAndSelect("solicitud.alumno", "usuario")
            .leftJoinAndSelect("solicitud.electivo", "electivo")
            .leftJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
            .leftJoinAndSelect("alumno.carrera", "carrera")
            .select([
                "solicitud.id",
                "solicitud.prioridad",
                "solicitud.fecha_solicitud",
                "solicitud.estado",
                "usuario.id",
                "usuario.rut",
                "usuario.nombre_completo",
                "usuario.email",
                "electivo.id",
                "electivo.nombre",
                "electivo.creditos",
                "electivo.cupos",
                "carrera.id",
                "carrera.codigo",
                "carrera.nombre"
            ])
            .orderBy("solicitud.fecha_solicitud", "DESC");
        
        // LÓGICA CLAVE: Filtrar por carrera SOLO si el jefe NO es super admin
        if (jefe.carrera !== null) {
            // Jefe específico: solo ve solicitudes de SU carrera
            query.andWhere("carrera.id = :carreraId", { 
                carreraId: jefe.carrera.id 
            });
        }
        // Si jefe.carrera === null → es SUPER ADMIN → ve TODAS las solicitudes
        
        // Aplicar filtros opcionales
        if (filtros.estado) {
            query.andWhere("solicitud.estado = :estado", { 
                estado: filtros.estado 
            });
        }
        
        if (filtros.electivo_id) {
            query.andWhere("solicitud.electivo_id = :electivoId", { 
                electivoId: filtros.electivo_id 
            });
        }
        
        const solicitudes = await query.getMany();
        
        // Obtener información de alumno con carrera para cada solicitud
        const solicitudesFormateadas = await Promise.all(solicitudes.map(async (sol) => {
            const alumnoInfo = await alumnoRepository.findOne({
                where: { usuario_id: sol.alumno.id },
                relations: ["carrera"]
            });
            
            return {
                id: sol.id,
                alumno: {
                    nombre: sol.alumno.nombre_completo,
                    rut: sol.alumno.rut,
                    email: sol.alumno.email,
                    carrera: alumnoInfo?.carrera?.nombre || "Sin carrera"
                },
                peticion: {
                    electivo: sol.electivo.nombre,
                    creditos: sol.electivo.creditos,
                    cupos_totales: sol.electivo.cupos
                },
                prioridad: sol.prioridad,
                fecha_solicitud: sol.fecha_solicitud,
                estado: sol.estado
            };
        }));
        
        return { data: solicitudesFormateadas };
        
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        return { error: "Error al consultar solicitudes" };
    }
}

/**
 * Cambiar el estado de una solicitud PENDIENTE a ACEPTADO o RECHAZADO
 * Solo el jefe de la carrera correspondiente (o super admin) puede hacerlo
 * 
 * @param {number} solicitudId - ID de la solicitud a modificar
 * @param {string} nuevoEstado - "ACEPTADO" o "RECHAZADO"
 * @param {number} jefeId - ID del jefe que hace el cambio
 * @returns {Object} { data: solicitud actualizada } o { error: mensaje }
 */
export async function cambiarEstadoSolicitudService(solicitudId, nuevoEstado, jefeId) {
    try {
        const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
        
        // 1. Validar que el estado sea válido (solo ACEPTADO o RECHAZADO)
        if (!["ACEPTADO", "RECHAZADO"].includes(nuevoEstado)) {
            return { error: "Estado inválido. Solo se permite: ACEPTADO o RECHAZADO" };
        }
        
        // 2. Obtener información del jefe autenticado con su carrera
        const jefe = await usuarioRepository.findOne({
            where: { id: jefeId },
            relations: ["carrera"]
        });
        
        if (!jefe) {
            return { error: "Jefe de carrera no encontrado" };
        }
        
        // 3. Obtener la solicitud con sus relaciones
        const solicitud = await solicitudRepository.findOne({
            where: { id: solicitudId },
            relations: ["alumno", "electivo"]
        });
        
        if (!solicitud) {
            return { error: "Solicitud no encontrada" };
        }
        
        // 4. Validar que la solicitud esté en estado PENDIENTE
        // Solo se pueden aprobar/rechazar solicitudes PENDIENTES
        if (solicitud.estado !== "PENDIENTE") {
            return { 
                error: `No se puede cambiar el estado. La solicitud ya está en estado: ${solicitud.estado}` 
            };
        }
        
        // 5. Obtener información del alumno con su carrera
        const alumnoInfo = await alumnoRepository
            .createQueryBuilder("alumno")
            .leftJoinAndSelect("alumno.carrera", "carrera")
            .where("alumno.usuario_id = :usuarioId", { usuarioId: solicitud.alumno.id })
            .getOne();
        
        if (!alumnoInfo || !alumnoInfo.carrera) {
            return { error: "El alumno no tiene carrera asignada" };
        }
        
        // 6. VALIDACIÓN DE PERMISOS: Verificar que el jefe pueda modificar esta solicitud
        // Si el jefe tiene carrera asignada (NO es super admin), solo puede modificar solicitudes de SU carrera
        if (jefe.carrera !== null) {
            if (alumnoInfo.carrera.id !== jefe.carrera.id) {
                return { 
                    error: `No tienes permisos para modificar solicitudes de ${alumnoInfo.carrera.nombre}. Solo puedes gestionar solicitudes de ${jefe.carrera.nombre}` 
                };
            }
        }
        // Si jefe.carrera === null → es SUPER ADMIN → puede modificar cualquier solicitud
        
        // 7. Si el nuevo estado es ACEPTADO, validar que haya cupos disponibles
        if (nuevoEstado === "ACEPTADO") {
            // Obtener el cupo asignado para la carrera del alumno en este electivo
            const cupoCarrera = await cupoPorCarreraRepository.findOne({
                where: {
                    electivo: { id: solicitud.electivo.id },
                    carrera: { id: alumnoInfo.carrera.id }
                }
            });
            
            if (!cupoCarrera) {
                return { error: "No hay cupos asignados para esta carrera en este electivo" };
            }
            
            // Contar cuántas solicitudes ACEPTADAS hay actualmente para esta carrera en este electivo
            const cuposOcupados = await solicitudRepository
                .createQueryBuilder("sol")
                .innerJoin("sol.alumno", "usuario")
                .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
                .innerJoin("alumno.carrera", "carrera")
                .where("sol.electivo_id = :electivoId", { electivoId: solicitud.electivo.id })
                .andWhere("carrera.id = :carreraId", { carreraId: alumnoInfo.carrera.id })
                .andWhere("sol.estado = :estado", { estado: "ACEPTADO" })
                .getCount();
            
            // Validar que no se exceda el cupo
            if (cuposOcupados >= cupoCarrera.cantidad_reservada) {
                return { 
                    error: `No hay cupos disponibles para ${alumnoInfo.carrera.nombre}. Cupos: ${cupoCarrera.cantidad_reservada}, Ocupados: ${cuposOcupados}` 
                };
            }
            
            console.log(`[APROBACIÓN] Jefe ${jefe.nombre_completo} aprobó solicitud de ${solicitud.alumno.nombre_completo} para "${solicitud.electivo.nombre}". Cupos restantes: ${cupoCarrera.cantidad_reservada - cuposOcupados - 1}/${cupoCarrera.cantidad_reservada}`);
        } else {
            // Estado RECHAZADO
            console.log(`[RECHAZO] Jefe ${jefe.nombre_completo} rechazó solicitud de ${solicitud.alumno.nombre_completo} para "${solicitud.electivo.nombre}"`);
        }
        
        // 8. Cambiar el estado de la solicitud
        solicitud.estado = nuevoEstado;
        const solicitudActualizada = await solicitudRepository.save(solicitud);
        
        // 9. Retornar la solicitud actualizada con información formateada
        return { 
            data: {
                id: solicitudActualizada.id,
                estado: solicitudActualizada.estado,
                alumno: {
                    nombre: solicitudActualizada.alumno.nombre_completo,
                    rut: solicitudActualizada.alumno.rut,
                    carrera: alumnoInfo.carrera.nombre
                },
                electivo: {
                    nombre: solicitudActualizada.electivo.nombre,
                    creditos: solicitudActualizada.electivo.creditos
                }
            }
        };
        
    } catch (error) {
        console.error("Error al cambiar estado de solicitud:", error);
        return { error: "Error al actualizar el estado de la solicitud" };
    }
}

/**
 * Mover una solicitud de LISTA_ESPERA a PENDIENTE manualmente
 * El jefe decide cuándo revisar la lista de espera y mover solicitudes a revisión
 * 
 * @param {number} solicitudId - ID de la solicitud en lista de espera
 * @param {number} jefeId - ID del jefe que hace el cambio
 * @returns {Object} { data: solicitud actualizada } o { error: mensaje }
 */
export async function moverListaEsperaAPendienteService(solicitudId, jefeId) {
    try {
        const solicitudRepository = AppDataSource.getRepository(SolicitudInscripcion);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const cupoPorCarreraRepository = AppDataSource.getRepository(CupoPorCarrera);
        
        // 1. Obtener información del jefe autenticado con su carrera
        const jefe = await usuarioRepository.findOne({
            where: { id: jefeId },
            relations: ["carrera"]
        });
        
        if (!jefe) {
            return { error: "Jefe de carrera no encontrado" };
        }
        
        // 2. Obtener la solicitud con sus relaciones
        const solicitud = await solicitudRepository.findOne({
            where: { id: solicitudId },
            relations: ["alumno", "electivo"]
        });
        
        if (!solicitud) {
            return { error: "Solicitud no encontrada" };
        }
        
        // 3. Validar que la solicitud esté en LISTA_ESPERA
        if (solicitud.estado !== "LISTA_ESPERA") {
            return { 
                error: `Esta solicitud no está en lista de espera. Estado actual: ${solicitud.estado}` 
            };
        }
        
        // 4. Obtener información del alumno con su carrera
        const alumnoInfo = await alumnoRepository
            .createQueryBuilder("alumno")
            .leftJoinAndSelect("alumno.carrera", "carrera")
            .where("alumno.usuario_id = :usuarioId", { usuarioId: solicitud.alumno.id })
            .getOne();
        
        if (!alumnoInfo || !alumnoInfo.carrera) {
            return { error: "El alumno no tiene carrera asignada" };
        }
        
        // 5. VALIDACIÓN DE PERMISOS: Verificar que el jefe pueda modificar esta solicitud
        if (jefe.carrera !== null) {
            if (alumnoInfo.carrera.id !== jefe.carrera.id) {
                return { 
                    error: `No tienes permisos para modificar solicitudes de ${alumnoInfo.carrera.nombre}` 
                };
            }
        }
        
        // 6. Validar que haya cupos disponibles antes de mover a PENDIENTE
        // Obtener el cupo asignado para la carrera del alumno
        const cupoCarrera = await cupoPorCarreraRepository.findOne({
            where: {
                electivo: { id: solicitud.electivo.id },
                carrera: { id: alumnoInfo.carrera.id }
            }
        });
        
        if (!cupoCarrera) {
            return { error: "No hay cupos asignados para esta carrera en este electivo" };
        }
        
        // Contar solicitudes ACEPTADAS + PENDIENTES (ocupan cupos temporalmente)
        const cuposOcupados = await solicitudRepository
            .createQueryBuilder("sol")
            .innerJoin("sol.alumno", "usuario")
            .innerJoin("alumnos", "alumno", "alumno.usuario_id = usuario.id")
            .innerJoin("alumno.carrera", "carrera")
            .where("sol.electivo_id = :electivoId", { electivoId: solicitud.electivo.id })
            .andWhere("carrera.id = :carreraId", { carreraId: alumnoInfo.carrera.id })
            .andWhere("sol.estado IN (:...estados)", { estados: ["ACEPTADO", "PENDIENTE"] })
            .getCount();
        
        // Validar que haya espacio
        if (cuposOcupados >= cupoCarrera.cantidad_reservada) {
            return { 
                error: `No se puede mover a revisión. No hay cupos disponibles para ${alumnoInfo.carrera.nombre}. Cupos: ${cupoCarrera.cantidad_reservada}, Ocupados: ${cuposOcupados}` 
            };
        }
        
        // 7. Mover de LISTA_ESPERA → PENDIENTE
        solicitud.estado = "PENDIENTE";
        const solicitudActualizada = await solicitudRepository.save(solicitud);
        
        console.log(`[LISTA ESPERA → PENDIENTE] Jefe ${jefe.nombre_completo} movió a revisión la solicitud de ${solicitud.alumno.nombre_completo} para "${solicitud.electivo.nombre}". Cupos disponibles: ${cupoCarrera.cantidad_reservada - cuposOcupados - 1}/${cupoCarrera.cantidad_reservada}`);
        
        // 8. Retornar la solicitud actualizada
        return { 
            data: {
                id: solicitudActualizada.id,
                estado: solicitudActualizada.estado,
                alumno: {
                    nombre: solicitudActualizada.alumno.nombre_completo,
                    rut: solicitudActualizada.alumno.rut,
                    carrera: alumnoInfo.carrera.nombre
                },
                electivo: {
                    nombre: solicitudActualizada.electivo.nombre,
                    creditos: solicitudActualizada.electivo.creditos
                },
                cuposDisponibles: cupoCarrera.cantidad_reservada - cuposOcupados - 1
            }
        };
        
    } catch (error) {
        console.error("Error al mover solicitud de lista de espera:", error);
        return { error: "Error al mover la solicitud a revisión" };
    }
}