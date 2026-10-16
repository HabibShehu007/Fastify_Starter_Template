// src/db/migrate.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pkg from "pg";
const { Pool } = pkg;

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in environment variables");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("⏳ Running database migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
