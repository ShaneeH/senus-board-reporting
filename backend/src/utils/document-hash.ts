import crypto from "crypto";

export function generateDocumentHash(pdf: Buffer): string {
    return crypto
        .createHash("sha256")
        .update(pdf)
        .digest("hex");
}