export interface FinancialComparison {
    revenueGrowth: number | null;
    grossProfitGrowth: number | null;
    operatingProfitGrowth: number | null;
    ebitdaGrowth: number | null;
    netProfitGrowth: number | null;
    cashGrowth: number | null;
    debtGrowth: number | null;
    customerGrowth: number | null;
    netAssetGrowth: number | null;
}

export interface FinancialPeriod {

    financials: {
        companyId: number;
        companyName: string;
        period: string;
        periodLabel: string;
        periodEnd: string;

        revenue: number;
        grossProfit: number;
        operatingProfit: number;
        ebitda: number;
        netProfit: number;
        cash: number;
        debt: number;
        customers: number;
        netAssets: number;
    };

    metrics: {
        grossMargin: number | null;
        operatingMargin: number | null;
        ebitdaMargin: number | null;
        netMargin: number | null;
        cashToDebtRatio: number | null;
        netCash: number | null;
        revenuePerCustomer: number | null;
        roce: number | null;
        debtServiceCoverageRatio: number | null;
    };

    comparison?: FinancialComparison;
}