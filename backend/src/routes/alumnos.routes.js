import { Router } from "express";
import { createAlumnoController, deleteAlumnoController, getAllAlumnosController, getAlumnoByRutController, updateAlumnoController } from "../controllers/alumno.controller.js";

const alumnoRoutes = Router();

alumnoRoutes.post("/create", createAlumnoController);
alumnoRoutes.get("/obtener", getAllAlumnosController);
alumnoRoutes.get("/:rut", getAlumnoByRutController);
alumnoRoutes.put("/update:rut", updateAlumnoController);
alumnoRoutes.delete("/delete:rut", deleteAlumnoController);

export default alumnoRoutes;