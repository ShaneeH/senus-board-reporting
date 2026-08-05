import crypto from "crypto";

export function generateReportId(
    company: string | null,
    reportName: string | null
): string {

    if (!company || !reportName) {
        throw new Error(
            "Cannot generate report ID. Missing company or report name."
        );
    }

    const cleanCompany = company
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .replace(/\s+/g, "_");

    const cleanReportName = reportName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .replace(/\s+/g, "_");

    const key = `${cleanCompany}_${cleanReportName}`;

return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex")
    .slice(0, 16); // This makes it shorter and neater
}