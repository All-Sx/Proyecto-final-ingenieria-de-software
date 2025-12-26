import { Router } from "express";
import { createElectivo } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/electivos
router.post("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera", "Profesor"]), // 2. ¿Es Jefe de Carrera?
    createElectivo                // 3. Crear el electivo
);

export default router;