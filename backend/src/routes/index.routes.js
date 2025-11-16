import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import alumnoRoutes from "./alumnos.routes.js";
import electivoRoutes from "./electivo.routes.js";
import router from "./auth.routes.js";

export function routerApi(app) {
    const router = Router();
    app.use("/api", router);

    router.use("/auth", authRoutes);
    router.use("/profile", profileRoutes);
    router.use("/alumno", alumnoRoutes);
    router.use("/electivos", electivoRoutes);
}


export default router;
