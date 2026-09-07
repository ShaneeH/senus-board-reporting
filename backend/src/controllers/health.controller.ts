import { Request, Response } from "express";

import { db } from "../database/db";

// Converts the raw uptime in seconds into something easier to read.
const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);

    parts.push(`${secs}s`);

    return parts.join(" ");
};

export const healthCheck = (_req: Request, res: Response): void => {
    const uptimeSeconds = process.uptime();

    // Keep this public response intentionally small to avoid leaking host details.
    res.status(200).json({
        status: "ok",
        service: "Financial Reporting Platform API",
        version: "2.0.0",

        // Keep the timestamp readable when checking the endpoint manually.
        timestamp: new Date().toLocaleString("en-IE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short"
        }),

        uptime: formatUptime(uptimeSeconds),
        uptimeSeconds: Math.floor(uptimeSeconds)
    });
};

export const readinessCheck = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const startedAt = process.hrtime.bigint();

    try {
        await db.query("SELECT 1");
        const latencyMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        res.status(200).json({
            status: "ready",
            database: "connected",
            latencyMs: Number(latencyMs.toFixed(1)),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[health] database readiness check failed", error);
        res.status(503).json({
            status: "not_ready",
            database: "unavailable",
            timestamp: new Date().toISOString()
        });
    }
};
