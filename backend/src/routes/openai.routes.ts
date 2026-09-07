import { Router } from "express";
import { getOpenAIStatus } from "../services/openai.service";

const router = Router();

router.get("/status", (_req, res) => {
    const status = getOpenAIStatus();

    res.status(status.configured ? 200 : 503).json({
        success: status.configured,
        ...status
    });
});

// Kept as a backwards-compatible alias. It no longer spends tokens on a test call.
router.get("/hello", (_req, res) => {
    const status = getOpenAIStatus();

    res.status(status.configured ? 200 : 503).json({
        success: status.configured,
        message: status.configured
            ? "OpenAI is configured."
            : "OpenAI is not configured.",
        ...status
    });
});

export default router;
