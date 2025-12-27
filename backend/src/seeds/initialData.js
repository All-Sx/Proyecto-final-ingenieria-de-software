import { AppDataSource } from "../config/configdb.js";
import { Rol } from "../entities/rol.entity.js";
import { Usuario } from "../entities/usuarios.entity.js"; 
import bcrypt from "bcryptjs"; 

export async function createData() {
  await seedRoles();      
  await seedUserAdmin();  
}

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


async function seedUserAdmin() {
  const userRepository = AppDataSource.getRepository(Usuario);
  const rolRepository = AppDataSource.getRepository(Rol);

  const userExist = await userRepository.findOne({ 
      where: { email: "jefe@carrera.cl" } 
  });

  if (userExist) {
    console.log("[SEED] El usuario Jefe de Carrera ya existe.");
    return;
  }

  const rolJefe = await rolRepository.findOneBy({ nombre: "Jefe de Carrera" });

  if (!rolJefe) {
    console.log("[SEED] Error: No se encontró el rol 'Jefe de Carrera'.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  const newAdmin = userRepository.create({
    rut: "11.111.111-1",
    email: "jefe@carrera.cl",
    password_hash: passwordHash,
    nombre_completo: "Admin",
    activo: true,
    rol: rolJefe, 
  });

  await userRepository.save(newAdmin);
  console.log("[SEED] Usuario Jefe de Carrera creado exitosamente.");
  }
