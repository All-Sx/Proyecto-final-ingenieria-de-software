import { Router } from "express";
import { createCarrera, getCarreras } from "../controllers/carrera.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// GET /api/carreras
// Obtener todas las carreras
router.get("/", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    getCarreras
);

// POST /api/carreras
// Crear una nueva carrera
router.post("/", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    createCarrera
);

export default router;