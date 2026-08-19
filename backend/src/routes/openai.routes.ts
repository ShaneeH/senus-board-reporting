import { Router } from "express";
import { basicPrompt } from "../services/openai.service";

const router = Router();

router.get("/hello", async (req, res) => {
    try {
        const response = await basicPrompt("Hello sir");

        res.json({
            success: true,
            response
        });
    } catch (error) {
        // Log the actual error for debugging
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to contact OpenAI"
        });
    }
});

export default router;