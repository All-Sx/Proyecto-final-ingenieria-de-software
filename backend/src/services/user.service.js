import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = userRepository.create({
        rut: data.rut,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        password: hashedPassword,
        cargo: data.cargo,
    });

    return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
    return await userRepository.findOneBy({ email });
}
export async function findUserByRut(rut) {
    return await userRepository.findOneBy({ rut });
}
export async function updateUser(rut, data) {
    try {
        const user = await userRepository.findOneBy({ rut });
        await userRepository.update(user.id, user);
    } catch (error) {
        throw new Error("Usuario no encontrado", error);
    }
}
export async function deleteUser(rut) {
    try {
        const user = await userRepository.findOneBy({ rut });
        await userRepository.remove(user);
    } catch (error) {
        throw new Error("Usuario no encontrado", error);
    }
    return true;
}
export async function getAllUsers() {
    return await userRepository.find();
}
