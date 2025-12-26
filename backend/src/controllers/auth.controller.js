import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Rol } from "../entities/rol.entity.js";
import { Alumno } from "../entities/alumno.entity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configenv.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email y contraseña son requeridos" 
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);

    // Buscar usuario con su rol
    const user = await userRepository.findOne({
      where: { email },
      relations: ["rol"]
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        nombre_completo: user.nombre_completo,  // Agregamos el nombre al token
        rol: user.rol.nombre 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        rut: user.rut,
        nombre: user.nombre_completo,
        email: user.email,
        rol: user.rol.nombre
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error en el servidor al hacer login" });
  }
};

export const register = async (req, res) => {
  try {

    const { rut, nombre_completo, email, password, rol } = req.body;

    
    if (!rut || !nombre_completo || !email || !password) {
      return res.status(400).json({ 
        message: "Faltan datos requeridos (rut, nombre, email, password)" 
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    // Verificar si el usuario ya existe
    const userExist = await userRepository.findOne({
      where: [
        { email:  email },
        { rut:  rut }
      ]
    });

    if (userExist) {
      return res.status(409).json({ message: "El usuario (rut o email) ya existe." });
    }

    // Buscar el rol (si se proporciona rol, úsalo; si no, usa "Alumno" por defecto)
    let rolEntity;
    if (rol) {
      rolEntity = await rolRepository.findOneBy({ nombre: rol });
      if (!rolEntity) {
        return res.status(400).json({ message: `El rol '${rol}' no existe.` });
      }
    } else {
      rolEntity = await rolRepository.findOneBy({ nombre: "Alumno" });
      if (!rolEntity) {
        return res.status(500).json({ message: "Error interno: El rol 'Alumno' no existe en la BD." });
      }
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario con el rol correspondiente
    const newUser = userRepository.create({
      rut,
      nombre_completo,
      email,
      password_hash: passwordHash,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      rol: rolEntity,  // Ahora usa el rol que encontramos
=======
      rol: rol,  
>>>>>>> Stashed changes
=======
      rol: rol,  
>>>>>>> Stashed changes
      activo: true
    });

    const usuarioGuardado = await userRepository.save(newUser);

    // Si el rol es "Alumno", crear entrada en tabla alumnos (sin carrera asignada aún)
    if (rolEntity.nombre === "Alumno") {
      const alumnoRepository = AppDataSource.getRepository(Alumno);
      const nuevoAlumno = alumnoRepository.create({
        usuario_id: usuarioGuardado.id,
        carrera: null,  // La carrera se asignará después
        anio_ingreso: new Date().getFullYear(),
        creditos_acumulados: 0
      });
      await alumnoRepository.save(nuevoAlumno);
    }

    // Responder con el rol correcto
    return res.status(201).json({
      message: `Usuario registrado exitosamente como ${rolEntity.nombre}`,
      user: {
        rut:  usuarioGuardado.rut,
        nombre: usuarioGuardado.nombre_completo,
        email: usuarioGuardado.email,
        rol: rolEntity.nombre  //Ahora mostrará el rol correcto
      }
    });

  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error en el servidor al registrar usuario" });
  }
};