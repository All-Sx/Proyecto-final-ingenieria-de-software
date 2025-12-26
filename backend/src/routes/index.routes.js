import { Router } from "express";
import authRoutes from "./auth.routes.js";
import electivoRoutes from "./electivo.routes.js";
import userRoutes from "./usuario.routes.js";
import inscripcionRoutes from "./inscripcion.routes.js";


export function routerApi(app) {
    const router = Router();
    
    // Aquí defines la URL base, ej: http://localhost:3000/api
    app.use("/api", router);

    // Rutas hijas
    router.use("/auth", authRoutes);      // /api/auth
    router.use("/electivos", electivoRoutes); // /api/electivos
    router.use("/usuarios", userRoutes);     // /api/usuarios
    router.use("/inscripciones", inscripcionRoutes); // /api/inscripciones
}
