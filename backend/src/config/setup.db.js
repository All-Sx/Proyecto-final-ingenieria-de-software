import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export async function createDatabaseIfNotExists() {
  const dbName = process.env.DATABASE; 
  const dbUser = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;

  const client = new pg.Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: "postgres",
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`La base de datos "${dbName}" no existe. Creando...`);
      
      // Creamos la base de datos
      await client.query(`CREATE DATABASE "${dbName}"`);
      
      console.log(`Base de datos "${dbName}" creada exitosamente.`);
    } else {
      console.log(`La base de datos "${dbName}" ya existe.`);
    }

  } catch (error) {
    console.error("Error al verificar/crear la base de datos:", error);
    console.error("Verifica que tus credenciales en el .env sean correctas.");
    process.exit(1);
  } finally {
    await client.end();
  }
}