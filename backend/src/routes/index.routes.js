import { Router } from "express";
import authRoutes from "./auth.routes.js";
import electivoRoutes from "./electivo.routes.js";
import periodoRoutes from "./periodo.routes.js";
import userRoutes from "./usuario.routes.js";
import inscripcionRoutes from "./inscripcion.routes.js";
import carreraRoutes from "./carrera.routes.js";
import alumnoRoutes from "./alumno.routes.js";


export function routerApi(app) {
    const router = Router();
    
    
    app.use("/api", router);

    
    router.use("/auth", authRoutes);      
    router.use("/electivos", electivoRoutes); 
    router.use("/periodos", periodoRoutes); 
    router.use("/usuarios", userRoutes);     
    router.use("/inscripciones", inscripcionRoutes); 
    router.use("/carreras", carreraRoutes); 
    router.use("/alumnos", alumnoRoutes);   
}
