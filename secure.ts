
import "dotenv/config";
import { Pool } from "pg";
import { z } from "zod";

// Create the PostgreSQL connection pool.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Allow only approved product categories.
const querySchema = z.object({
  category: z.enum(["Gifts", "Clothing", "Accessories"]),
});

export async function getProducts(req: { query: unknown }) {
  // Validate user input before using it.
  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new Error("Invalid query parameters");
  }

  const { category } = parsed.data;

  // SAFE: $1 treats category as a value, not SQL syntax.
  const result = await pool.query(
    `SELECT name, description
     FROM products
     WHERE category = $1
       AND released = 1`,
    [category],
  );

  return result.rows;
}