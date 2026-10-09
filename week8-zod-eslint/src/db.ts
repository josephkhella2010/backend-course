import { Pool } from "pg";
import { env } from "./env.js";

console.log("DB config:", {
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
});

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

export default pool;
