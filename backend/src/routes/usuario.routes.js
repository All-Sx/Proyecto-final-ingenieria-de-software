import { Router } from "express";
import { createUserAdmin } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { deleteUsuarioDeAlumnoByRut } from "../controllers/jefeCarrera.controller.js";

const router = Router();

// POST /api/users/create
router.post("/create",
    authMiddleware,               // 1. Token válido
    isAdmin(["Jefe de Carrera"]), // 2. Solo Jefe de Carrera
    createUserAdmin               // 3. Crear usuario
);
router.delete("/delete/alumno",
    authMiddleware,               // Con estas lineas da error
    isAdmin(["Jefe de Carrera"]), // Pero sin ellas se elimina con exito
    deleteUsuarioDeAlumnoByRut
);

export default router;