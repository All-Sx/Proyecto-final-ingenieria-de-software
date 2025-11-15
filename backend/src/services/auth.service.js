import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "./admin.service.js";

export async function loginAdmin(email, password) {
    const admin = await findAdminByEmail(email);
    if (!admin) {
        throw new Error("Credenciales incorrectas");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error("Credenciales incorrectas");
    }

    const payload = { sub: admin.id, email: admin.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    delete admin.password;
    return { admin, token }; 
}