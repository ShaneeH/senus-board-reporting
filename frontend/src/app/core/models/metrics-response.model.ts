export interface FinancialPeriod {

  period: string;
  periodLabel: string;

  revenue: number;
  grossProfit?: number;

  operatingLoss?: number;
  netLoss?: number;

  customers?: number | null;

  cashAndEquivalents: number;

  netAssets?: number;

  grossMargin?: number;

  revenueGrowthYoY?: number;

  avgRevenuePerCustomer?: number;

  source: string;
  sourceUrl: string;

}

export interface MetricsResponse {

  success: boolean;

  data: {

    fy2024: FinancialPeriod;

    fy2025: FinancialPeriod;

    h1_2026: FinancialPeriod;

  };

}