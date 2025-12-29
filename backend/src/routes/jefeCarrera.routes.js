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

router.post("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    createJefeCarrera
);

router.get("/solicitudes/pendientes", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getSolicitudesPendientes
);

router.patch("/solicitudes/:id/estado", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    cambiarEstadoSolicitud
);

router.patch("/solicitudes/:id/mover-a-pendiente", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    moverListaEsperaAPendiente
);

router.delete("/alumno", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    deleteUsuarioDeAlumnoByRut
);

router.get("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getJefesCarrera
);

router.get("/:rut", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getJefeByRut
);

export default router;