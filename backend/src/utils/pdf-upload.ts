import { Express } from "express";

export class PdfUploadError extends Error {
    constructor(message: string, public readonly status = 400) {
        super(message);
        this.name = "PdfUploadError";
    }
}

function configuredSizeMb(): number {
    const parsed = Number(process.env.MAX_PDF_SIZE_MB);
    return Number.isFinite(parsed) && parsed >= 1 && parsed <= 100
        ? parsed
        : 20;
}

export const maxPdfBytes = configuredSizeMb() * 1024 * 1024;

export function validatePdfUpload(file: Express.Multer.File): void {
    if (!file.originalname.toLowerCase().endsWith(".pdf")) {
        throw new PdfUploadError("Only files with a .pdf extension are accepted.");
    }

    if (file.mimetype !== "application/pdf") {
        throw new PdfUploadError("The uploaded file must use the application/pdf MIME type.");
    }

    if (file.size < 16 || file.buffer.length < 16) {
        throw new PdfUploadError("The uploaded PDF is empty or incomplete.");
    }

    if (!file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
        throw new PdfUploadError("The uploaded file does not have a valid PDF signature.");
    }

    const ending = file.buffer
        .subarray(Math.max(0, file.buffer.length - 4096))
        .toString("latin1");

    if (!ending.includes("%%EOF")) {
        throw new PdfUploadError("The uploaded PDF appears to be truncated.");
    }
}
