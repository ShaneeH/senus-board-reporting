import { FinancialReport } from "./financial-report.model";

export interface UploadReportResponse {

    message: string;

    uploadedPdfId: string;

    documentHash: string;

    report: FinancialReport;

}