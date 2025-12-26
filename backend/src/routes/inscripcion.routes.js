import { Router } from "express";
import { createSolicitud, getMisSolicitudes } from "../controllers/inscripcion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.post("/", 
    authMiddleware,
    isAdmin(["Alumno"]), 
    createSolicitud
);

router.get("/solicitudes", 
    authMiddleware,
    isAdmin(["Alumno"]), 
    getMisSolicitudes
);

export default router;