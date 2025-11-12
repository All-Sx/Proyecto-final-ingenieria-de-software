import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource, connectDB } from "./config/configDB.js";
import { routerApi } from "./routes/index.routes.js";
import { HOST, PORT} from "./config/configenv.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin: ["http://localhost:5173","http://146.83.198.35:1351"],credentials: true}));

// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
connectDB()
  .then(() => {
    // Carga todas las rutas de la aplicación
    routerApi(app);

    // Levanta el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
