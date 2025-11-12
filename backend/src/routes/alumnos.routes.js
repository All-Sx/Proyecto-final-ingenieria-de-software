import { Router } from "express";
import { createAlumnoController, deleteAlumnoController, getAllAlumnosController, getAlumnoByRutController, updateAlumnoController } from "../controllers/alumno.controller.js";

const alumnoRoutes = Router();

alumnoRoutes.post("/", createAlumnoController);
alumnoRoutes.get("/", getAllAlumnosController);
alumnoRoutes.get("/:rut", getAlumnoByRutController);
alumnoRoutes.put("/:rut", updateAlumnoController);
alumnoRoutes.delete("/:rut", deleteAlumnoController);

export default alumnoRoutes;