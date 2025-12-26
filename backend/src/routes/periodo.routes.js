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


router.get("/:id",
    authMiddleware,
    getPeriodoById
);


router.patch("/:id/estado",
    authMiddleware,
    isAdmin(["Jefe de Carrera"]),
    updateEstadoPeriodo
);

export default router;
