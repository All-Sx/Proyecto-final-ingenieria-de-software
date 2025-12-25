import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import bcrypt from "bcryptjs"; //npm install bcryptjs
import jwt from "jsonwebtoken"; //npm install jsonwebtoken
import { JWT_SECRET } from "../config/configenv.js";
import { Rol } from "../entities/rol.entity.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(Usuario);

    // 1. Buscamos el usuario por email
    const user = await userRepository.findOne({ 
        where: { email },
        relations: ["rol"] // Traemos también el rol para saber quién es
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 2. Comparamos la contraseña enviada con la encriptada
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 3. (Opcional) Generar Token JWT
    // Si no tienes configurado JWT aún, puedes omitir esta parte del token
    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol.nombre }, 
        JWT_SECRET, // Debería ir en tu .env
        { expiresIn: "1h" }
    );

    // 4. Responder éxito
    return res.json({
      message: "Login exitoso",
      token: token,
      user: {
        nombre: user.nombreCompleto,
        email: user.email,
        rol: user.rol.nombre
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const register = async (req, res) => {
  try {
    // 1. Recibir datos del cliente
    const { rut, nombre_completo, email, password } = req.body;

    // Validación básica
    if (!rut || !nombre_completo || !email || !password) {
      return res.status(400).json({ 
        message: "Faltan datos requeridos (rut, nombre, email, password)" 
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    // 2. Verificar si el usuario ya existe (por email o rut)
    const userExist = await userRepository.findOne({
      where: [
        { email: email },
        { rut: rut }
      ]
    });

    if (userExist) {
      return res.status(409).json({ message: "El usuario (rut o email) ya existe." });
    }

    // 3. Buscar el rol de "Alumno" para asignarlo automáticamente
    const rolAlumno = await rolRepository.findOneBy({ nombre: "Alumno" });

    if (!rolAlumno) {
      return res.status(500).json({ message: "Error interno: El rol 'Alumno' no existe en la BD." });
    }

    // 4. Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Crear y guardar el usuario
    const newUser = userRepository.create({
      rut,
      nombre_completo,
      email,
      password_hash: passwordHash, // Usamos el nombre exacto de tu columna en la BD
      rol: rolAlumno,
      activo: true
    });

    await userRepository.save(newUser);

    // 6. Responder con éxito
    return res.status(201).json({
      message: "Alumno registrado exitosamente",
      user: {
        rut: newUser.rut,
        nombre: newUser.nombre_completo,
        email: newUser.email,
        rol: newUser.rol.nombre
      }
    });

  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error en el servidor al registrar usuario" });
  }
};