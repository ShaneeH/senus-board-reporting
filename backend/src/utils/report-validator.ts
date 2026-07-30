export interface FinancialPeriod {
    period: string | null;
    periodEnd: string | null;
    periodLabel: string | null;
    revenue: number | null;
    grossProfit: number | null;
    operatingProfit: number | null;
    ebitda: number | null;
    netProfit: number | null;
    cash: number | null;
    debt: number | null;
    customers: number | null;
    netAssets: number | null;
    summary: string | null;
}

export interface FinancialReport {
    company: string;
    reportName: string;
    reportType: string;
    reportDate: string | null;
    currency: string | null;
    source: string | null;
    periods: FinancialPeriod[];
    summary: string | null;
}

export function parseAndValidateReport(
    aiResponse: string
): FinancialReport {
    let report: unknown;

    try {
        report = JSON.parse(aiResponse);
    } catch {
        throw new Error("OpenAI returned invalid JSON.");
    }

    if (!report || typeof report !== "object") {
        throw new Error("OpenAI returned an invalid report.");
    }

    const candidate = report as Partial<FinancialReport>;

    if (
        typeof candidate.company !== "string" ||
        candidate.company.trim() === ""
    ) {
        throw new Error(
            "Unable to determine the company from the uploaded PDF."
        );
    }

    if (
        typeof candidate.reportName !== "string" ||
        candidate.reportName.trim() === ""
    ) {
        throw new Error(
            "Unable to determine the report name from the uploaded PDF."
        );
    }

    if (
        typeof candidate.reportType !== "string" ||
        candidate.reportType.trim() === ""
    ) {
        throw new Error(
            "Unable to determine the report type from the uploaded PDF."
        );
    }

    if (
        !Array.isArray(candidate.periods) ||
        candidate.periods.length === 0
    ) {
        throw new Error(
            "No financial reporting periods were found in the uploaded PDF."
        );
    }

    return candidate as FinancialReport;
}