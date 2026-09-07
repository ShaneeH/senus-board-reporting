import { randomUUID } from "node:crypto";

import { NextFunction, Request, Response } from "express";

export function securityHeaders(
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
    );

    if (process.env.NODE_ENV === "production") {
        res.setHeader(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
        );
    }

    next();
}

export function requestContext(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const incomingId = req.header("x-request-id");
    const requestId = incomingId && /^[A-Za-z0-9._-]{1,80}$/.test(incomingId)
        ? incomingId
        : randomUUID();
    const startedAt = process.hrtime.bigint();
    const requestPath = req.originalUrl.split("?", 1)[0];

    res.locals.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);

    res.on("finish", () => {
        const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        console.log(
            `[http] ${req.method} ${requestPath} ${res.statusCode} ${elapsedMs.toFixed(1)}ms request=${requestId}`
        );
    });

    next();
}

export function getAllowedOrigins(): Set<string> {
    const configured = process.env.CORS_ORIGINS
        ?.split(",")
        .map(origin => origin.trim())
        .filter(Boolean);

    return new Set(
        configured?.length
            ? configured
            : ["http://localhost:4200", "http://127.0.0.1:4200"]
    );
}
