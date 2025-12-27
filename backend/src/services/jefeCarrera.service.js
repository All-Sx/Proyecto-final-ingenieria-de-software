import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js"; 
import { Rol } from "../entities/rol.entity.js";
import { Carrera } from "../entities/academico.entity.js";
import { SolicitudInscripcion } from "../entities/inscripcion.entity.js";
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