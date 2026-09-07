import "dotenv/config";

import { Pool } from "pg";

function parseInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const useSsl = process.env.DB_SSL === "true";

export const db = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: parseInteger(process.env.DB_PORT, 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? "senus",
  max: parseInteger(process.env.DB_POOL_SIZE, 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: useSsl
    ? {
        rejectUnauthorized:
          process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"
      }
    : undefined
});

db.on("error", error => {
  console.error("[database] idle client error", error);
});
