import { Router } from "express";
import { 
    createElectivo, 
    getElectivos, 
    aprobarElectivo, 
    rechazarElectivo 
} from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/electivos - Crear electivo (SOLO PROFESORES)
router.post("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Profesor"]),        // 2. ¿Es Profesor?
    createElectivo                // 3. Crear el electivo
);

// GET /api/electivos - Ver lista de electivos (Profesor ve los suyos, Jefe ve todos)
router.get("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera", "Profesor"]), // 2. ¿Es Jefe o Profesor?
    getElectivos                  // 3. Obtener lista
);

// PUT /api/electivos/:id/aprobar - Aprobar un electivo (SOLO JEFE DE CARRERA)
router.put("/:id/aprobar",
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera"]), // 2. ¿Es Jefe de Carrera?
    aprobarElectivo               // 3. Aprobar el electivo
);

// PUT /api/electivos/:id/rechazar - Rechazar un electivo (SOLO JEFE DE CARRERA)
router.put("/:id/rechazar",
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera"]), // 2. ¿Es Jefe de Carrera?
    rechazarElectivo              // 3. Rechazar el electivo
);

export default router;