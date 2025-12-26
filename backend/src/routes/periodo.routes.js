import { Router } from "express";
import {
    createPeriodo,
    updatePeriodoFechas,
    getAllPeriodos,
    getPeriodoById,
    getPeriodoActual,
    updateEstadoPeriodo
} from "../controllers/periodo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// POST /api/periodos - Crear nuevo periodo académico
router.post("/",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    createPeriodo
);

// PUT /api/periodos/:id - Actualizar fechas de un periodo
router.put("/:id",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    updatePeriodoFechas
);

// GET /api/periodos - Obtener todos los periodos
router.get("/",
    authMiddleware,
    getAllPeriodos
);

// GET /api/periodos/actual - Obtener el periodo actual
router.get("/actual",
    authMiddleware,
    getPeriodoActual
);

// GET /api/periodos/:id - Obtener un periodo específico
router.get("/:id",
    authMiddleware,
    getPeriodoById
);

// PATCH /api/periodos/:id/estado - Cambiar el estado de un periodo
router.patch("/:id/estado",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    updateEstadoPeriodo
);

export default router;
