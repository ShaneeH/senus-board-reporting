import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import openAiRoutes from "./routes/openai.routes";
import reportRoutes from "./routes/report.routes";
import companiesRouter from "./routes/companies.routes";
import { apiLimiter } from "./middleware/rate-limit";
import {
    getAllowedOrigins,
    requestContext,
    securityHeaders
} from "./middleware/security";

const app = express();
const allowedOrigins = getAllowedOrigins();

app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);

app.use(requestContext);
app.use(securityHeaders);
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-Id"],
    exposedHeaders: ["Content-Disposition", "X-Request-Id"],
    maxAge: 600
}));
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiLimiter);
app.use("/api/health", healthRoutes);
app.use("/api/openai", openAiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/companies", companiesRouter);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found.",
        requestId: res.locals.requestId
    });
});

app.use((
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (res.headersSent) return;

    const errorType = typeof error === "object" && error !== null && "type" in error
        ? error.type
        : null;

    if (errorType === "entity.parse.failed") {
        res.status(400).json({
            success: false,
            error: "The request body contains invalid JSON.",
            requestId: res.locals.requestId
        });
        return;
    }

    if (errorType === "entity.too.large") {
        res.status(413).json({
            success: false,
            error: "The request body is too large.",
            requestId: res.locals.requestId
        });
        return;
    }

    console.error(`[http] unhandled request=${res.locals.requestId}`, error);

    res.status(500).json({
        success: false,
        error: "An unexpected server error occurred.",
        requestId: res.locals.requestId
    });
});

export default app;
