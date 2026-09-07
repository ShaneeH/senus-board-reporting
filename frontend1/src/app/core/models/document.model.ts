export interface DocumentPeriod {
  periodId: number;
  period: string;
  periodLabel: string;
  periodEnd: string | null;
}

export interface FinancialDocument {
  documentId: number;
  companyId: number;
  companyName: string;
  reportName: string;
  reportType: string;
  reportDate: string | null;
  currency: string | null;
  source: string | null;
  uploadedAt: string;
  periods: DocumentPeriod[];
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

export type ReportExportFormat = 'json' | 'pdf' | 'csv';
