import { Router } from "express";

import { createElectivo, getElectivos, getMisElectivos, updateElectivo, getElectivosAprobados } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.post("/", 
    authMiddleware,              
    isAdmin(["Jefe de Carrera", "Profesor"]), 
    createElectivo                
);


router.get("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera", "Alumno"]), 
    getElectivos
);


router.get("/mis-electivos", 
    authMiddleware,                    
    isAdmin(["Profesor"]),            
    getMisElectivos                    
);


router.get("/aprobados", 
    authMiddleware,
    isAdmin(["Alumno"]),
    getElectivosAprobados
);

router.put("/:id", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), 
    updateElectivo
);

export default router;