import { Router } from "express";
import multer from "multer";

import { db } from "../database/db";
import {analysePDF,uploadPDF} from "../services/openai.service";

import { analysePrompt } from "../utils/prompts";
import { generateReportId } from "../utils/report-id";
import { parseAndValidateReport} from "../utils/report-validator";

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
router.post( "/add", upload.single("report"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No PDF uploaded.",
                });
            }

            // First of all we get the PDF from the User 
            // Then send it to OpenAI Upload API
            const pdfId = await uploadPDF(req.file.buffer);

            // We then get A.I analysis on the PDF using our prompt 
            const aiResponse = await analysePDF(
                pdfId,
                analysePrompt
            );

            // We Make sure the Response is Valid
            const aiReport = parseAndValidateReport(aiResponse);

            // We then generate an ID for that Report
            const reportId = generateReportId(
                aiReport.company,
                aiReport.reportName
            );

            // Check whether report already exists

            // Insert document into PostgreSQL

            // Insert financial periods into PostgreSQL

            return res.status(200).json({
                success: true,
                message:
                    "The PDF was successfully uploaded and analysed.",
                uploadedPdfId: pdfId,
                reportId,
                report: aiReport,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown error";

            console.error(message);

            const validationErrors = [
                "OpenAI returned invalid JSON.",
                "OpenAI returned an invalid report.",
                "Unable to determine the company from the uploaded PDF.",
                "Unable to determine the report name from the uploaded PDF.",
                "Unable to determine the report type from the uploaded PDF.",
                "No financial reporting periods were found in the uploaded PDF.",
            ];

            const status = validationErrors.includes(message)
                ? 400
                : 500;

            return res.status(status).json({
                success: false,
                error: message,
            });
        }
    }
);

export default router;