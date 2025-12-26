import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js"; 
import { Rol } from "../entities/rol.entity.js";         
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
        relations: ["rol"], 
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