import { Router } from "express";
import { createElectivo, getElectivos } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/electivos - Crear electivo (SOLO PROFESORES)
router.post("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Profesor"]),        // 2. ¿Es Profesor?
    createElectivo                // 3. Crear el electivo
);

// GET /api/electivos - Obtener lista de electivos (SOLO JEFE DE CARRERA)
router.get("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera"]), // 2. ¿Es Jefe de Carrera?
    getElectivos                  // 3. Obtener lista
);

export default router;