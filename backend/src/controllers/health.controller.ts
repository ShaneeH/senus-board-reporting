import { Request, Response } from "express";

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

    res.status(200).json({
        status: "ok",
        service: "Financial Reporting Platform API",
        version: "1.0.0",
        environment: process.env.NODE_ENV ?? "development",
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
        memory: {
            usedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            totalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
    });
};