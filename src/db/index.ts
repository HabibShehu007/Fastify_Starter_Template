// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL environment parameter is missing inside your .env configuration.",
  );
}

const { Pool } = pg;

// 🛠️ Updated Pool configuration with explicit TLS/SSL settings for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000, // Give it up to 10 seconds before timing out
  idleTimeoutMillis: 60000,
  max: 10,
});

export const db = drizzle(pool, { schema });
