import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response): void => {
    res.status(200).json({
        status: "ok",
        service: "Financial Reporting Platform API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};