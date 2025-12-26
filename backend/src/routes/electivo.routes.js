import { Router } from "express";
import { createElectivo, getElectivos, updateElectivo } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/electivos
router.post("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera", "Profesor"]), // 2. ¿Es Jefe de Carrera?
    createElectivo                // 3. Crear el electivo
);

router.get("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]), // Restringido solo al Jefe
    getElectivos
);

router.put("/:id", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), // Solo el Jefe puede editar
    updateElectivo
);

export default router;