import { Router } from "express";
<<<<<<< Updated upstream
import { createUserAdmin } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 
=======
import { createUserAdmin, getAlumnos, getProfesores } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
>>>>>>> Stashed changes
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/users/create
router.post("/create", 
    authMiddleware,               // 1. Token válido
    isAdmin(["Jefe de Carrera"]), // 2. Solo Jefe de Carrera
    createUserAdmin               // 3. Crear usuario
);
<<<<<<< Updated upstream
=======

// GET /api/usuarios/alumnos - Obtener todos los alumnos
router.get("/alumnos",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getAlumnos
);

// GET /api/usuarios/profesores - Obtener todos los profesores
router.get("/profesores",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getProfesores
);

router.delete("/delete/alumno",
    authMiddleware,               // Con estas lineas da error
    isAdmin(["Jefe de Carrera"]), // Pero sin ellas se elimina con exito
    deleteUsuarioDeAlumnoByRut
);
>>>>>>> Stashed changes

export default router;