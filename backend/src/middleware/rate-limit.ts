import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        error: "Too many requests."
    }

});

export const uploadLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        error: "Too many PDF uploads. Please try again later."
    }

});