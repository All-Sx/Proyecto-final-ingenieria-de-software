import { Router } from "express";
import { createCarrera, getCarreras } from "../controllers/carrera.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    getCarreras
);

router.post("/", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    createCarrera
);

export default router;