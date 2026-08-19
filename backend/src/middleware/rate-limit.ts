import rateLimit from "express-rate-limit";

// General rate limit for normal API requests.
// This helps prevent someone from repeatedly hitting the backend.
export const apiLimiter = rateLimit({
    // Each IP gets a fresh request allowance every 15 minutes.
    windowMs: 15 * 60 * 1000,

    // Maximum of 100 requests within the 15 minute window.
    limit: 100,

    // Sends the modern RateLimit headers back to the client.
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        error: "Too many requests."
    }
});

// Uploads have a much stricter limit because each PDF may trigger
export const uploadLimiter = rateLimit({
    // Upload limits are also measured across a 15 minute window.
    windowMs: 15 * 60 * 1000,

    // Allows up to 10 PDF uploads per IP during that period.
    limit: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        error: "Too many PDF uploads. Please try again later."
    }
});