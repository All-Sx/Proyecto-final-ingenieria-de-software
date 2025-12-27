import { Router } from "express";
import { 
    createJefeCarrera, 
    getJefesCarrera, 
    getJefeByRut, 
    deleteUsuarioDeAlumnoByRut,
    getSolicitudesPendientes,
    cambiarEstadoSolicitud,
    moverListaEsperaAPendiente
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

// PATCH /api/jefe-carrera/solicitudes/:id/estado
// Cambiar el estado de una solicitud PENDIENTE a ACEPTADO o RECHAZADO
router.patch("/solicitudes/:id/estado", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    cambiarEstadoSolicitud
);

// PATCH /api/jefe-carrera/solicitudes/:id/mover-a-pendiente
// Mover una solicitud de LISTA_ESPERA a PENDIENTE manualmente
router.patch("/solicitudes/:id/mover-a-pendiente", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    moverListaEsperaAPendiente
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
