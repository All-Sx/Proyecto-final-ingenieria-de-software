import { Router } from "express";
import { createSolicitud, getMisSolicitudes } from "../controllers/inscripcion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/inscripciones
router.post("/", 
    authMiddleware,
    isAdmin(["Alumno"]), // Solo los alumnos pueden inscribir ramos
    createSolicitud
);

router.get("/solicitudes", 
    authMiddleware,
    isAdmin(["Alumno"]), // Solo alumnos
    getMisSolicitudes
);

export default router;