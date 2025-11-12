import { Router } from "express";
import carreraController from "../controllers/carrera.controller.js";

const carreraRoutes = Router();

carreraRoutes.post("/", carreraController.createCarrera);
carreraRoutes.get("/", carreraController.getAllCarreras);
carreraRoutes.get("/:codigo", carreraController.getCarreraByCodigo);
carreraRoutes.put("/:codigo", carreraController.updateCarrera);
carreraRoutes.delete("/:codigo", carreraController.deleteCarrera);

export default carreraRoutes;