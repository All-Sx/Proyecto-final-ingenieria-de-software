import { loginAdmin } from "../services/auth.service.js";
import { createAdmin } from "../services/admin.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responsehandlers.js";
import { authRegisterValidation, authLoginValidation } from "../validations/auth.validation.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const { error } = authLoginValidation.validate({ email, password });
    if (error) {
      return handleErrorClient(res, 400, "Parametros invalidos", error.message);
    }
    
    const data = await loginAdmin(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function register(req, res) {
  try {
    const data = req.body;
    
    const { error } = authRegisterValidation.validate(data);
    if (error) {
      return handleErrorClient(res, 400, "Parametros invalidos", error.message);
    }
    
    console.log("DATOS QUE LLEGAN:", data);
    const newAdmin = await createAdmin(data);
    delete newAdmin.password; // Nunca devolver la contraseña
    handleSuccess(res, 201, "Usuario registrado exitosamente", newAdmin);
  } catch (error) {
    if (error.code === '23505') { // Código de error de PostgreSQL para violación de unique constraint
      handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}