import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Rol } from "../entities/rol.entity.js";
import bcrypt from "bcryptjs";

export async function createUserWithRoleService(data) {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    // 1. Validar que el usuario no exista (RUT o Email)
    const userExist = await userRepository.findOne({
      where: [{ email: data.email }, { rut: data.rut }]
    });

    if (userExist) {
      return { error: "El usuario ya existe (rut o email duplicado)." };
    }

    // 2. Buscar el Rol especificado
    const rolEntity = await rolRepository.findOneBy({ nombre: data.rolNombre });

    if (!rolEntity) {
      return { error: `El rol '${data.rolNombre}' no existe.` };
    }

    // 3. Encriptar contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 4. Crear usuario
    const newUser = userRepository.create({
      rut: data.rut,
      nombre_completo: data.nombre_completo,
      email: data.email,
      password_hash: passwordHash,
      rol: rolEntity,
      activo: true
    });

    const userSaved = await userRepository.save(newUser);

    // Eliminamos la password del objeto retornado por seguridad
    const { password_hash, ...userSinPass } = userSaved;
    
    return { data: userSinPass };

  } catch (error) {
    console.error("Error en createUserWithRoleService:", error);
    return { error: "Error interno al crear el usuario." };
  }
}

// Obtener todos los alumnos
export async function getAlumnosService() {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    // Buscar el rol "Alumno"
    const rolAlumno = await rolRepository.findOneBy({ nombre: "Alumno" });

    if (!rolAlumno) {
      return { error: "No se encontró el rol 'Alumno'." };
    }

    // Obtener todos los usuarios con rol de Alumno
    const alumnos = await userRepository.find({
      where: { rol: { id: rolAlumno.id } },
      relations: ["rol"],
      select: ["id", "rut", "nombre_completo", "email", "activo", "created_at"]
    });

    return { data: alumnos };

  } catch (error) {
    console.error("Error en getAlumnosService:", error);
    return { error: "Error interno al obtener alumnos." };
  }
}

// Obtener todos los profesores
export async function getProfesoresService() {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    // Buscar el rol "Profesor"
    const rolProfesor = await rolRepository.findOneBy({ nombre: "Profesor" });

    if (!rolProfesor) {
      return { error: "No se encontró el rol 'Profesor'." };
    }

    // Obtener todos los usuarios con rol de Profesor
    const profesores = await userRepository.find({
      where: { rol: { id: rolProfesor.id } },
      relations: ["rol"],
      select: ["id", "rut", "nombre_completo", "email", "activo", "created_at"]
    });

    return { data: profesores };

  } catch (error) {
    console.error("Error en getProfesoresService:", error);
    return { error: "Error interno al obtener profesores." };
  }
}