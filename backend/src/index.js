import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createDatabaseIfNotExists } from "./config/setup.db.js";
import { AppDataSource, connectDB } from "./config/configdb.js";
import { routerApi } from "./routes/index.routes.js";
import { HOST, PORT} from "./config/configenv.js";
import { createData } from "./seeds/initialData.js";


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin: [
  "http://localhost:5173",
  "http://localhost:5177",
  "http://146.83.198.35:1351"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

async function main() {
  try {
    await createDatabaseIfNotExists();

    await connectDB();

    await createData();

    routerApi(app);

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
    });

  } catch (error) {
    console.error(" Error crítico al iniciar la aplicación:", error);
    process.exit(1);
  }
}

main();