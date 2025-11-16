import { AppDataSource } from "../config/configdb.js";
import { Admin } from "../entities/admin.entity.js";
import bcrypt from "bcrypt";

const adminRepository = AppDataSource.getRepository(Admin);

export async function createAdmin(data) {
    console.log("--> createAdmin recibió:", data);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAdmin = adminRepository.create({
        rut: data.rut,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        password: hashedPassword,
    });
    console.log("--> Objeto preparado para guardar:", newAdmin);
    return await adminRepository.save(newAdmin);
}

export async function findAdminByEmail(email) {
    return await adminRepository.findOneBy({ email });
}
export async function findUserByRut(rut) {
    return await adminRepository.findOneBy({ rut });
}