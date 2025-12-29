import { Router } from "express";
import {
    createPeriodo,
    updatePeriodoFechas,
    getAllPeriodos,
    getPeriodoById,
    getPeriodoActual,
    updateEstadoPeriodo,
    deletePeriodo,
    getPeriodosHistorial,
    archivarPeriodo
} from "../controllers/periodo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.post("/",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    createPeriodo
);

router.put("/:id",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    updatePeriodoFechas
);


router.get("/",
    authMiddleware,
    getAllPeriodos
);


router.get("/actual",
    authMiddleware,
    getPeriodoActual
);

router.get("/historial",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    getPeriodosHistorial
);

router.get("/:id",
    authMiddleware,
    getPeriodoById
);


router.patch("/:id/estado",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    updateEstadoPeriodo
);

router.patch("/:id/archivar",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    archivarPeriodo
);

router.delete("/:id",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    deletePeriodo
);

export default router;
