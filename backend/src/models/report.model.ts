// models/financial-report.model.ts

export interface FinancialReportResponse {
  success: boolean;
  message: string;
  uploadedPdfId: string;
  reportId: string;
  report: FinancialReport;
}

export interface FinancialReport {
  company: string;
  reportName: string;
  reportType: string;
  reportDate: string; // ISO date string e.g. "2026-05-08"
  currency: string;
  source: string | null;
  periods: FinancialPeriod[];
  summary: string;
}

export interface FinancialPeriod {
  period: string;           // e.g. "FY2025", "Q4 FY2025"
  periodEnd: string;        // ISO date string e.g. "2026-03-31"
  periodLabel: string;      // e.g. "Full Year Ended 31 March 2026"
  revenue: number | null;
  grossProfit: number | null;
  operatingProfit: number | null;
  ebitda: number | null;
  netProfit: number | null;
  cash: number | null;
  debt: number | null;
  customers: number | null;
  netAssets: number | null;
  summary: string;
}