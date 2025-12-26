import { Router } from "express";
import { createUserAdmin, getAlumnos, getProfesores } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { deleteUsuarioDeAlumnoByRut } from "../controllers/jefeCarrera.controller.js";

const router = Router();


router.post("/create",
    authMiddleware,               
    isAdmin(["Jefe de Carrera"]), 
    createUserAdmin               
);
router.delete("/delete/alumno",
    authMiddleware,               
    isAdmin(["Jefe de Carrera"]), 
    deleteUsuarioDeAlumnoByRut
);

router.get("/alumnos",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getAlumnos
);

router.get("/profesores",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getProfesores
);

export default router;