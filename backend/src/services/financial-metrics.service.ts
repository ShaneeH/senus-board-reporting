import { FinancialPeriod } from "../utils/report-validator";

export interface FinancialMetrics {
    grossMargin: number | null;
    operatingMargin: number | null;
    ebitdaMargin: number | null;
    netMargin: number | null;
    cashToDebtRatio: number | null;
    netCash: number | null;
    revenuePerCustomer: number | null;
    roce: number | null;
    debtServiceCoverageRatio: number | null;
}

export function calculateFinancialMetrics(
    period: FinancialPeriod
): FinancialMetrics {
    return {
        grossMargin: calculatePercentage(
            period.grossProfit,
            period.revenue
        ),

        operatingMargin: calculatePercentage(
            period.operatingProfit,
            period.revenue
        ),

        ebitdaMargin: calculatePercentage(
            period.ebitda,
            period.revenue
        ),

        netMargin: calculatePercentage(
            period.netProfit,
            period.revenue
        ),

        cashToDebtRatio: calculateRatio(
            period.cash,
            period.debt
        ),

        netCash: calculateDifference(
            period.cash,
            period.debt
        ),

        revenuePerCustomer: calculateRatio(
            period.revenue,
            period.customers
        ),

        /*
         * ROCE requires a reliable capital employed figure.
         * Capital employed normally requires total assets and
         * current liabilities, or equity and long term debt.
         *
         * The current extraction schema does not provide enough
         * information to calculate this accurately.
         */
        roce: null,

        /*
         * Debt service coverage requires debt repayments,
         * interest expense or another reliable debt service value.
         *
         * The current extraction schema does not provide this.
         */
        debtServiceCoverageRatio: null
    };
}

function calculatePercentage(
    numerator: number | null,
    denominator: number | null
): number | null {
    if (
        numerator === null ||
        denominator === null ||
        denominator === 0
    ) {
        return null;
    }

    return roundToTwoDecimals(
        (numerator / denominator) * 100
    );
}

function calculateRatio(
    numerator: number | null,
    denominator: number | null
): number | null {
    if (
        numerator === null ||
        denominator === null ||
        denominator === 0
    ) {
        return null;
    }

    return roundToTwoDecimals(
        numerator / denominator
    );
}

function calculateDifference(
    firstValue: number | null,
    secondValue: number | null
): number | null {
    if (
        firstValue === null ||
        secondValue === null
    ) {
        return null;
    }

    return roundToTwoDecimals(
        firstValue - secondValue
    );
}

function roundToTwoDecimals(
    value: number
): number {
    return Math.round(
        (value + Number.EPSILON) * 100
    ) / 100;
}