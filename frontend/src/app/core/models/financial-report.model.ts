import { FinancialReportPeriod } from "./financial-report-period.model";

export interface FinancialReport {

    company: string;

    reportName: string;

    reportType: string;

    reportDate: string | null;

    currency: string | null;

    source: string | null;

    periods: FinancialReportPeriod[];

}