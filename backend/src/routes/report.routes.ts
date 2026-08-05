import { Router } from "express";
import multer from "multer";

import { db } from "../database/db";

import {
    analysePDF,
    uploadPDF
} from "../services/openai.service";

import {
    saveFinancialDocument,
    DuplicateDocumentError
} from "../services/documents.service";

import { analysePrompt } from "../utils/prompts";
import { generateDocumentHash } from "../utils/document-hash";
import { parseAndValidateReport } from "../utils/report-validator";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/test-db", async (_req, res) => {
    try {

        const result = await db.query("SELECT NOW();");

        return res.json({
            success: true,
            databaseTime: result.rows[0].now,
        });

    } catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : "Unknown error";

        console.error(message);

        return res.status(500).json({
            success: false,
            error: message,
        });

    }
});

// Adds a new financial PDF
router.post(
    "/add",
    upload.single("report"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No PDF uploaded."
                });
            }

            // Get the uploaded PDF
            const pdfBuffer = req.file.buffer;

            // Generate a SHA256 hash
            const documentHash =
                generateDocumentHash(pdfBuffer);

            // Reject duplicate PDFs

            // Upload the PDF to OpenAI
            const pdfId =
                await uploadPDF(pdfBuffer);

            // Analyse the document
            const aiResponse =
                await analysePDF(
                    pdfId,
                    analysePrompt
                );

            // Validate the returned JSON
            const aiReport =
                parseAndValidateReport(aiResponse);

            // Save everything
            await saveFinancialDocument(
                documentHash,
                pdfId,
                aiReport
            );

            return res.status(201).json({

                success: true,

                message:
                    "The PDF was successfully uploaded and analysed.",

                uploadedPdfId: pdfId,

                documentHash,

                report: aiReport

            });

        }
        catch (error) {

            if (error instanceof DuplicateDocumentError) {

                return res.status(409).json({

                    success: false,

                    error: error.message

                });

            }

            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown error";

            console.error(message);

            return res.status(500).json({

                success: false,

                error: message

            });

        }

    }
);

export default router;