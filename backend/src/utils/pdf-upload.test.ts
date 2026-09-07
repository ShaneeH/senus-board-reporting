import assert from "node:assert/strict";
import test from "node:test";

import { validatePdfUpload } from "./pdf-upload";

function uploadedFile(buffer: Buffer, overrides: Record<string, unknown> = {}) {
    return {
        fieldname: "file",
        originalname: "report.pdf",
        encoding: "7bit",
        mimetype: "application/pdf",
        size: buffer.length,
        buffer,
        ...overrides
    } as Express.Multer.File;
}

test("accepts a PDF with a valid signature and trailer", () => {
    assert.doesNotThrow(() => validatePdfUpload(
        uploadedFile(Buffer.from("%PDF-1.4\nreport data\n%%EOF\n"))
    ));
});

test("rejects spoofed and truncated PDF uploads", () => {
    assert.throws(
        () => validatePdfUpload(uploadedFile(Buffer.from("not a real pdf document"))),
        /signature/
    );
    assert.throws(
        () => validatePdfUpload(uploadedFile(Buffer.from("%PDF-1.4\nmissing trailer"))),
        /truncated/
    );
});

