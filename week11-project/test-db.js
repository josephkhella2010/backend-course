import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  port: 5440,
  database: "postgres",
  user: "postgres",
  password: "root",
});

async function test() {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT system_identifier FROM pg_control_system()",
    );

    console.log("Windows connection identity:");
    console.table(result.rows);

    const databases = await client.query(
      "SELECT datname FROM pg_database ORDER BY datname",
    );

    console.log("Available databases:");
    console.table(databases.rows);
  } catch (error) {
    console.error("Connection error:", error.message);
  } finally {
    await client.end();
  }
}

test();
