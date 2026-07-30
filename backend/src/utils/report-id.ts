export function generateReportId(
    company: string | null,
    reportName: string | null
): string {

    if (!company || !reportName) {
        throw new Error("Cannot generate report ID. Missing company or report name.");
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

    return `${cleanCompany}_${cleanReportName}`;
}