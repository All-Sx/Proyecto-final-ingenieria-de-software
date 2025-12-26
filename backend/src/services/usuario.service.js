import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Rol } from "../entities/rol.entity.js";
import bcrypt from "bcryptjs";

export async function createUserWithRoleService(data) {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    const userExist = await userRepository.findOne({
      where: [{ email: data.email }, { rut: data.rut }]
    });

    if (userExist) {
      return { error: "El usuario ya existe (rut o email duplicado)." };
    }

    const rolEntity = await rolRepository.findOneBy({ nombre: data.rolNombre });

    if (!rolEntity) {
      return { error: `El rol '${data.rolNombre}' no existe.` };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = userRepository.create({
      rut: data.rut,
      nombre_completo: data.nombre_completo,
      email: data.email,
      password_hash: passwordHash,
      rol: rolEntity,
      activo: true
    });

    const userSaved = await userRepository.save(newUser);

    const { password_hash, ...userSinPass } = userSaved;
    
    return { data: userSinPass };

  } catch (error) {
    console.error("Error en createUserWithRoleService:", error);
    return { error: "Error interno al crear el usuario." };
  }
}

export async function getAlumnosService() {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    const rolAlumno = await rolRepository.findOneBy({ nombre: "Alumno" });

    if (!rolAlumno) {
      return { error: "No se encontró el rol 'Alumno'." };
    }

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

export async function getProfesoresService() {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    const rolProfesor = await rolRepository.findOneBy({ nombre: "Profesor" });

    if (!rolProfesor) {
      return { error: "No se encontró el rol 'Profesor'." };
    }

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