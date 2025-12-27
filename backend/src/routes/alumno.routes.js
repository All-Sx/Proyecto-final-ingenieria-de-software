import { Router } from "express";
import { asignarCarrera } from "../controllers/alumno.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.put("/:id/asignar-carrera", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    asignarCarrera
);

export default router;