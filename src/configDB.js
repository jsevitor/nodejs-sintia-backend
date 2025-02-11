import pkg from 'pg'; 
import dotenv from "dotenv";

const { Pool } = pkg; 

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "seu_usuario",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "seu_banco_de_dados",
  password: process.env.DB_PASSWORD || "sua_senha",
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export { pool };
