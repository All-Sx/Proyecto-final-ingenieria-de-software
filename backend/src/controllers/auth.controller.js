import { AppDataSource } from "../config/configdb.js";
import { Usuario } from "../entities/usuarios.entity.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config/configenv.js";
import { Rol } from "../entities/rol.entity.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(Usuario);

    
    const user = await userRepository.findOne({ 
        where: { email },
        relations: ["rol"] 
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol.nombre }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );

    
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
    
    const { rut, nombre_completo, email, password } = req.body;

   
    if (!rut || !nombre_completo || !email || !password) {
      return res.status(400).json({ 
        message: "Faltan datos requeridos (rut, nombre, email, password)" 
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);

    const userExist = await userRepository.findOne({
      where: [
        { email: email },
        { rut: rut }
      ]
    });

    if (userExist) {
      return res.status(409).json({ message: "El usuario (rut o email) ya existe." });
    }

    const rolAlumno = await rolRepository.findOneBy({ nombre: "Alumno" });

    if (!rolAlumno) {
      return res.status(500).json({ message: "Error interno: El rol 'Alumno' no existe en la BD." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      rut,
      nombre_completo,
      email,
      password_hash: passwordHash, 
      rol: rolAlumno,
      activo: true
    });

    await userRepository.save(newUser);

    
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