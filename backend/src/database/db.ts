import { Pool } from "pg";

// Make Connection to Local DB

export const db = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: process.env.DB_PASSWORD,
  database: "senus",
});
