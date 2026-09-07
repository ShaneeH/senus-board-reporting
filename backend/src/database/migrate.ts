import "dotenv/config";

import { promises as fs } from "node:fs";
import path from "node:path";

import { db } from "./db";

const MIGRATION_DIRECTORY = path.resolve(
    __dirname,
    "../../database/migrations"
);

async function migrate(): Promise<void> {
    const client = await db.connect();

    try {
        await client.query("SELECT pg_advisory_lock($1)", [73_651_902]);
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                migration_name TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const files = (await fs.readdir(MIGRATION_DIRECTORY))
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            const applied = await client.query(
                "SELECT 1 FROM schema_migrations WHERE migration_name = $1",
                [file]
            );

            if (applied.rowCount) {
                console.log(`[database] ${file} already applied`);
                continue;
            }

            const sql = await fs.readFile(
                path.join(MIGRATION_DIRECTORY, file),
                "utf8"
            );

            await client.query("BEGIN");

            try {
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (migration_name) VALUES ($1)",
                    [file]
                );
                await client.query("COMMIT");
                console.log(`[database] applied ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            }
        }
    } finally {
        await client.query("SELECT pg_advisory_unlock($1)", [73_651_902]);
        client.release();
        await db.end();
    }
}

migrate().catch(error => {
    console.error("[database] migration failed", error);
    process.exitCode = 1;
});
