import { Router } from "express";
import multer from "multer";

import { db } from "../database/db";
import { analysePDF, uploadPDF } from "../services/openai.service";
import {
    DuplicateDocumentError,
    saveFinancialDocument
} from "../services/documents.service";
import { uploadLimiter } from "../middleware/rate-limit";
import { generateDocumentHash } from "../utils/document-hash";
import { analysePrompt } from "../utils/prompts";
import { parseAndValidateReport } from "../utils/report-validator";
import { getDocuments } from "../services/documents.service";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage()
});



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

router.get('/', async (_req, res) => {
  try {
    const documents = await getDocuments();

    return res.json(documents);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Failed to retrieve documents.'
    });
  }
});

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
            const documentHash = generateDocumentHash(pdf);
            const pdfId = await uploadPDF(pdf);
            const aiResponse = await analysePDF(pdfId, analysePrompt);
            const report = parseAndValidateReport(aiResponse);

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

// This needs to be worked on more
router.delete("/companies/:companyId/reports/:period", async (req, res) => {
    try {
        const companyId = Number(req.params.companyId);
        const period = req.params.period;

        if (!companyId || !period) {
            return res.status(400).json({
                success: false,
                error: "Invalid company or period"
            });
        }

        const result = await db.query(
            `
            DELETE FROM financial_periods
            WHERE company_id = $1
            AND period = $2
            `,
            [companyId, period]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Report not found"
            });
        }

        return res.json({
            success: true,
            message: `${period} deleted successfully`
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

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

export default router;