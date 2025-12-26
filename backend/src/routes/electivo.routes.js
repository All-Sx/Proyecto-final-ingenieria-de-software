import { Router } from "express";
// Importamos el NUEVO controlador getMisElectivos
import { createElectivo, getElectivos, getMisElectivos, updateElectivo, asignarCuposManual } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

//Crear electivo (SOLO PROFESORES)
router.post("/", 
    authMiddleware,               // 1. ¿Tiene token válido?
    isAdmin(["Jefe de Carrera", "Profesor"]), // 2. ¿Es Jefe de Carrera?
    createElectivo                // 3. Crear el electivo
);

//Ver TODOS los electivos (SOLO JEFE DE CARRERA)
router.get("/", 
    authMiddleware,
    isAdmin(["Jefe de Carrera"]), // Restringido solo al Jefe
    getElectivos
);

// NUEVA RUTA
// Para que un PROFESOR vea SOLO los electivos que ÉL creó
// Esta ruta debe ir ANTES de "/:id" para que no se confunda
router.get("/mis-electivos", 
    authMiddleware,                    // 1. Verificar que tenga token válido
    isAdmin(["Profesor"]),             // 2. Solo profesores pueden ver sus electivos
    getMisElectivos                    // 3. Filtrar y mostrar solo sus electivos
);

router.put("/:id", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), // Solo el Jefe puede editar
    updateElectivo
);

// POST /api/electivos/:id/asignar-cupos
// Para asignar cupos manualmente a electivos que ya fueron aprobados
router.post("/:id/asignar-cupos", 
    authMiddleware, 
    isAdmin(["Jefe de Carrera"]), // Solo el Jefe puede asignar cupos
    asignarCuposManual
);

export default router;