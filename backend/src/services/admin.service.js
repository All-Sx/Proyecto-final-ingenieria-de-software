import { AppDataSource } from "../config/configdb.js";
import { Admin } from "../entities/admin.entity.js";
import bcrypt from "bcrypt";

const adminRepository = AppDataSource.getRepository(Admin);

export async function createAdmin(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAdmin = adminRepository.create({
        rut: data.rut,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        password: hashedPassword,
    });

    return await adminRepository.save(newAdmin);
}

export async function findAdminByEmail(email) {
    return await adminRepository.findOneBy({ email });
}

export async function findAdminById(id) {
  return await adminRepository.findOneBy({ id });
}

export async function findAdminByRut(rut) {
    return await adminRepository.findOneBy({ rut });
}

export async function updateAdmin(rut, data) {
    try {
        const Admin = await adminRepository.findOneBy({ rut });
        await adminRepository.update(admin.id, admin);
    } catch (error) {
        throw new Error("Usuario no encontrado", error);
    }
}

export async function deleteAdmin(rut) {
    try {
        const Admin = await adminRepository.findOneBy({ rut });
        await adminRepository.remove(user);
    } catch (error) {
        throw new Error("Usuario no encontrado", error);
    }
    return true;
}

export async function getAllAdmins() {
    return await adminRepository.find();
}
