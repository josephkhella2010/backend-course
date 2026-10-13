
// vulnerable.ts

import { Pool } from "pg";
import type { Request } from "express";
import "dotenv/config";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getProductsVulnerable(req: Request) {
  const result = await pool.query(
    `SELECT name, description FROM products
     WHERE category = '${req.query.category}'
       AND released = 1`,
  );

  return result.rows;
}


