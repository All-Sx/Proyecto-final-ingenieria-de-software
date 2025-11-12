
import { loginUser } from "../services/auth.service.js";
import { createUser } from "../services/user.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responsehandlers.js";
import { authQueryValidation } from "../validations/auth.validation.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const { error } = authQueryValidation.validate({ email, password });
    if (error) {
      return handleErrorClient(res, 400, "Parametros invalidos", error.message);
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function register(req, res) {
  try {
    const data = req.body;
    
    const { error } = authQueryValidation.validate(data);
    if (error) {
      return handleErrorClient(res, 400, "Parametros invalidos", error.message);
    }
    
    const newUser = await createUser(data);
    delete newUser.password; // Nunca devolver la contraseña
    handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505') { // Código de error de PostgreSQL para violación de unique constraint
      handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}