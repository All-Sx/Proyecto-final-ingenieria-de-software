import { Router } from "express";
import alumnoController from "../controllers/alumno.controller";

const alumnoRoutes = Router();

alumnoRoutes.post("/", alumnoController.createAlumno);
alumnoRoutes.get("/", alumnoController.getAllAlumnos);
alumnoRoutes.get("/:rut", alumnoController.getAlumnoByRut);
alumnoRoutes.put("/:rut", alumnoController.updateAlumno);
alumnoRoutes.delete("/:rut", alumnoController.deleteAlumno);

export default alumnoRoutes;