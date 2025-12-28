import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Alumno } from "../entities/alumno.entity.js";
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

    // Limpiar respuesta eliminando campos de auditoría
    const respuestaLimpia = {
      id: userSaved.id,
      rut: userSaved.rut,
      nombre_completo: userSaved.nombre_completo,
      email: userSaved.email,
      activo: userSaved.activo,
      rol: userSaved.rol ? {
        id: userSaved.rol.id,
        nombre: userSaved.rol.nombre
      } : null
    };
    
    return { data: respuestaLimpia };

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
      relations: ["rol", "alumno", "alumno.carrera"],
      select: ["id", "rut", "nombre_completo", "email", "activo"]
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
      select: ["id", "rut", "nombre_completo", "email", "activo"]
    });

    return { data: profesores };

  } catch (error) {
    console.error("Error en getProfesoresService:", error);
    return { error: "Error interno al obtener profesores." };
  }
}

export async function getUserByIdService(id) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const alumnoRepository = AppDataSource.getRepository(Alumno);

    
    const usuario = await usuarioRepository.findOne({
      where: { id: id },
      relations: ["rol"] 
    });

    if (!usuario) {
      return { error: "Usuario no encontrado" };
    }

    // Crear respuesta limpia base
    const usuarioLimpio = {
      id: usuario.id,
      rut: usuario.rut,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      activo: usuario.activo,
      rol: usuario.rol ? {
        id: usuario.rol.id,
        nombre: usuario.rol.nombre
      } : null
    };

    if (usuario.rol.nombre === "Alumno") {
        const datosAlumno = await alumnoRepository.findOne({
            where: { usuario_id: id },
            relations: ["carrera"] 
        });

        if (datosAlumno) {
            const datosAcademicosLimpios = {
              usuario_id: datosAlumno.usuario_id,
              anio_ingreso: datosAlumno.anio_ingreso,
              creditos_acumulados: datosAlumno.creditos_acumulados,
              carrera: datosAlumno.carrera ? {
                id: datosAlumno.carrera.id,
                codigo: datosAlumno.carrera.codigo,
                nombre: datosAlumno.carrera.nombre
              } : null
            };
            return { data: { ...usuarioLimpio, datos_academicos: datosAcademicosLimpios } };
        }
    }

    // 3. Si es Jefe de Carrera o Profesor, devolvemos solo el usuario
    return { data: usuarioLimpio };

  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { error: "Error interno." };
  }
}

export async function updateUserService(id, data) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const usuario = await usuarioRepository.findOneBy({ id: id });

    if (!usuario) {
      return { error: "Usuario no encontrado" };
    }

    if (data.nombre_completo) usuario.nombre_completo = data.nombre_completo;
    if (data.email) usuario.email = data.email;

    await usuarioRepository.save(usuario);

    const usuarioActualizadoCompleto = await getUserByIdService(id);

    return usuarioActualizadoCompleto;

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { error: "Error interno al actualizar datos." };
  }
}