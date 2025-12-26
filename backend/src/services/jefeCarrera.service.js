import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuario.entity.js"; // Asegúrate de la ruta correcta
import { Rol } from "../entities/rol.entity.js";         // Asegúrate de la ruta correcta
import bcrypt from "bcrypt";

const usuarioRepository = AppDataSource.getRepository(Usuario);
const rolRepository = AppDataSource.getRepository(Rol);

export async function createJefeCarreraService(data) {
    // 1. Verificar si el usuario ya existe (por RUT o Email)
    const existingUser = await usuarioRepository.findOne({
        where: [{ rut: data.rut }, { email: data.email }]
    });

    if (existingUser) {
        throw new Error("El usuario ya existe con ese RUT o Email.");
    }

    // 2. Buscar el Rol de "Jefe de Carrera" (o Administrador)
    // Asumimos que la tabla roles ya tiene el rol 'Jefe de Carrera' creado.
    const rolJefe = await rolRepository.findOneBy({ nombre: "Jefe de Carrera" });

    if (!rolJefe) {
        throw new Error("El rol 'Jefe de Carrera' no existe en la base de datos.");
    }

    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Crear la instancia del usuario
    const newJefe = usuarioRepository.create({
        rut: data.rut,
        nombre_completo: data.nombre_completo,
        email: data.email,
        password_hash: hashedPassword,
        rol: rolJefe, // Asignamos la relación completa
        activo: true
    });

    // 5. Guardar y retornar (sin devolver la password)
    const savedUser = await usuarioRepository.save(newJefe);
    const { password_hash, ...userWithoutPassword } = savedUser;
    
    return userWithoutPassword;
}

export async function findAllJefesService() {
    // Buscamos usuarios cuyo rol sea 'Jefe de Carrera'
    return await usuarioRepository.find({
        where: {
            rol: { nombre: "Jefe de Carrera" }
        },
        relations: ["rol"], // Para ver la info del rol en la respuesta
        select: {
            // Opcional: Seleccionar campos específicos para no enviar hash
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
            rol: { nombre: "Jefe de Carrera" } // Aseguramos que sea Jefe, no alumno
        },
        relations: ["rol"]
    });
}