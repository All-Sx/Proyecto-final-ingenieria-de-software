import { Router } from "express";
import { createSolicitud, getMisSolicitudes, getCuposPorCarrera } from "../controllers/inscripcion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/inscripciones
router.post("/", 
    authMiddleware,
    isAdmin(["Alumno"]), // Solo los alumnos pueden inscribir ramos
    createSolicitud
);

// GET /api/inscripciones/solicitudes
router.get("/solicitudes", 
    authMiddleware,
    isAdmin(["Alumno"]), // Solo alumnos
    getMisSolicitudes
);

// GET /api/inscripciones/cupos/:electivo_id
// Consultar cupos disponibles por carrera en un electivo
router.get("/cupos/:electivo_id", 
    authMiddleware,
    getCuposPorCarrera
);

export default router;