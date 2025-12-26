import { AppDataSource } from "../config/configdb.js";
import { Rol } from "../entities/rol.entity.js";
import { Usuario } from "../entities/usuarios.entity.js"; // <--- OJO: Asegúrate que se llame así tu entidad de usuario
import bcrypt from "bcryptjs"; // Recuerda: npm install bcryptjs

// Función Principal (Orquestador)
export async function createData() {
  await seedRoles();      // 1. Primero creamos los roles
  await seedUserAdmin();  // 2. Después creamos el usuario con el rol asignado
}

// Lógica de Roles (La que ya tenías)
async function seedRoles() {
  const rolRepository = AppDataSource.getRepository(Rol);
  const rolesNombres = ["Jefe de Carrera", "Profesor", "Alumno"];

  for (const nombre of rolesNombres) {
    const rolExistente = await rolRepository.findOneBy({ nombre });
    if (!rolExistente) {
      const nuevoRol = rolRepository.create({ nombre });
      await rolRepository.save(nuevoRol);
      console.log(`[SEED] Rol creado: ${nombre}`);
    }
  }
}

// Lógica de Usuario Jefe de Carrera
async function seedUserAdmin() {
  const userRepository = AppDataSource.getRepository(Usuario);
  const rolRepository = AppDataSource.getRepository(Rol);

  // 1. Verificar si ya existe el usuario
  const userExist = await userRepository.findOne({ 
      where: { email: "jefe@carrera.cl" } // O valida por RUT si prefieres
  });

  if (userExist) {
    console.log("[SEED] El usuario Jefe de Carrera ya existe.");
    return;
  }

  // 2. Buscamos el objeto ROL "Jefe de Carrera" para asignarlo
  // Esto es vital: TypeORM necesita el objeto Rol, no solo el string.
  const rolJefe = await rolRepository.findOneBy({ nombre: "Jefe de Carrera" });

  if (!rolJefe) {
    console.log("[SEED] Error: No se encontró el rol 'Jefe de Carrera'.");
    return;
  }

  // 3. Crear el usuario
  const passwordHash = await bcrypt.hash("admin123", 10);

  const newAdmin = userRepository.create({
    rut: "11.111.111-1",
    email: "jefe@carrera.cl",
    password_hash: passwordHash,
    nombre_completo: "Admin",
    activo: true,
    rol: rolJefe, // <--- Aquí asignamos la relación
  });

  await userRepository.save(newAdmin);
  console.log("[SEED] Usuario Jefe de Carrera creado exitosamente.");
  }
