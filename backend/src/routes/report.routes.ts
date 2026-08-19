import { Router } from "express";
import multer from "multer";

import { db } from "../database/db";
import { analysePDF, uploadPDF } from "../services/openai.service";
import { DuplicateDocumentError, saveFinancialDocument } from "../services/documents.service";
import { uploadLimiter } from "../middleware/rate-limit";
import { generateDocumentHash } from "../utils/document-hash";
import { analysePrompt } from "../utils/prompts";
import { parseAndValidateReport } from "../utils/report-validator";

const router = Router();

// PDFs are only held in memory while being processed.
const upload = multer({
    storage: multer.memoryStorage()
});


// Checks that the backend can connect to PostgreSQL.
router.get("/test-db", async (_req, res) => {
    try {
        const result = await db.query("SELECT NOW();");

        return res.json({
            success: true,
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        const message = getErrorMessage(error);

        console.error(message);

        return res.status(500).json({
            success: false,
            error: message
        });
    }
});


// Uploads, analyses and saves a financial report.
router.post(
    "/add",
    uploadLimiter,
    upload.single("file"),

    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No PDF uploaded."
                });
            }

            const pdf = req.file.buffer;

            // Used to identify the exact PDF if it is uploaded again.
            const documentHash = generateDocumentHash(pdf);

            // Send the PDF to OpenAI.
            const pdfId = await uploadPDF(pdf);

            // Extract the financial data from the document.
            const aiResponse = await analysePDF(
                pdfId,
                analysePrompt
            );

            // Make sure OpenAI returned data in the expected format.
            const report = parseAndValidateReport(aiResponse);

            // Save the document and its financial periods.
            await saveFinancialDocument(
                documentHash,
                pdfId,
                report
            );

            return res.status(201).json({
                success: true,
                message: "The PDF was successfully uploaded and analysed.",
                uploadedPdfId: pdfId,
                documentHash,
                report
            });

        } catch (error) {
            if (error instanceof DuplicateDocumentError) {
                return res.status(409).json({
                    success: false,
                    error: error.message
                });
            }

            const message = getErrorMessage(error);

            console.error(message);

            return res.status(500).json({
                success: false,
                error: message
            });
        }
    }
);


// Keeps error handling a bit cleaner throughout the route.
function getErrorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "Unknown error";
}

export default router;