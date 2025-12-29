import { Router } from "express";
import { createCarrera, getCarreras } from "../controllers/carrera.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { isProfesor } from "../../../frontend/src/helpers/roles.js";

const router = Router();

router.get("/", 
    authMiddleware, 
    getCarreras
);

router.post("/", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    createCarrera
);

export default router;