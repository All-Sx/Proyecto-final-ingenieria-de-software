import { Router } from "express";
import electivoController from "../controllers/electivo.controller.js";

const electivoRoutes = Router();

electivoRoutes.post("/", electivoController.createElectivo);
electivoRoutes.get("/", electivoController.getAllElectivos);
electivoRoutes.get("/:codigo", electivoController.getElectivoByCodigo);
electivoRoutes.put("/:codigo", electivoController.updateElectivo);
electivoRoutes.delete("/:codigo", electivoController.deleteElectivo);

export default electivoRoutes;