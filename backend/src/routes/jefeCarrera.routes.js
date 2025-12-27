import { Router } from "express";
import { 
    createJefeCarrera, 
    getJefesCarrera, 
    getJefeByRut, 
    deleteUsuarioDeAlumnoByRut,
    getSolicitudesPendientes
} from "../controllers/jefeCarrera.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/jefe-carrera
// Crear un nuevo jefe de carrera
router.post("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    createJefeCarrera
);

// GET /api/jefe-carrera/solicitudes/pendientes
// Ver todas las solicitudes de alumnos (filtradas por carrera si no es super admin)
// IMPORTANTE: Esta ruta debe ir ANTES de /:rut para evitar que sea capturada como parámetro
router.get("/solicitudes/pendientes", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getSolicitudesPendientes
);

// DELETE /api/jefe-carrera/alumno
// Eliminar un alumno por RUT
router.delete("/alumno", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    deleteUsuarioDeAlumnoByRut
);

// GET /api/jefe-carrera
// Obtener todos los jefes de carrera
router.get("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getJefesCarrera
);

// GET /api/jefe-carrera/:rut
// Obtener un jefe de carrera por RUT
// IMPORTANTE: Esta ruta debe ir AL FINAL porque captura cualquier parámetro
router.get("/:rut", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getJefeByRut
);

export default router;
