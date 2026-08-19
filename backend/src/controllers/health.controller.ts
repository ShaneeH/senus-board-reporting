import { Request, Response } from "express";

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

export const healthCheck = (req: Request, res: Response): void => {
    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    // Basic API health information used to confirm the server is running.
    res.status(200).json({
        status: "ok",
        service: "Financial Reporting Platform API",
        version: "1.0.0",
        environment: process.env.NODE_ENV ?? "development",

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
        uptimeSeconds: Math.floor(uptimeSeconds),

        // Heap usage gives a quick view of how much memory Node is using.
        memory: {
            usedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            totalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        }
    });
};