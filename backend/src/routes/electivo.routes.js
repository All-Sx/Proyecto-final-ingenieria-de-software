import { Router } from "express";
import { createElectivo, getElectivos } from "../controllers/electivo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createElectivo);
router.get("/", getElectivos);

export default router;