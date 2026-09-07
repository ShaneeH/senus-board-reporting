import "dotenv/config";

import app from "./app";
import { db } from "./database/db";

const PORT = Number(process.env.PORT) || 3000;
let shuttingDown = false;

const server = app.listen(PORT, () => {
    console.log("\n  ◆ SENUS API");
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Health:  http://localhost:${PORT}/api/health`);
    console.log(`  Mode:    ${process.env.NODE_ENV ?? "development"}\n`);
});

function shutdown(signal: string): void {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\n[server] ${signal} received, closing connections...`);

    const forceTimer = setTimeout(() => {
        console.error("[server] graceful shutdown timed out");
        process.exit(1);
    }, 10_000);
    forceTimer.unref();

    server.close(async error => {
        try {
            await db.end();
        } catch (databaseError) {
            console.error("[server] database shutdown failed", databaseError);
            process.exitCode = 1;
        }

        clearTimeout(forceTimer);

        if (error) {
            console.error("[server] shutdown failed", error);
            process.exitCode = 1;
        }
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
