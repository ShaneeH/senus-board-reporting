export interface RawMetrics {
  period: string;
  periodLabel: string;
  revenue: number;
  grossProfit?: number;
  operatingLoss?: number;
  netLoss?: number;
  customers?: number;
  cashAndEquivalents?: number;
  netAssets?: number;
  source: string;
  sourceUrl?: string;
}

export interface ProcessedMetrics {
  fy2024: any;
  fy2025: any;
  h1_2026: any;
}