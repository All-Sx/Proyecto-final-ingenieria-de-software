import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import router from "./auth.routes.js";

export function routerApi(app) {
    const router = Router();
    app.use("/api", router);

    router.use("/auth", authRoutes);
    router.use("/profile", profileRoutes);
    
}

export default router;