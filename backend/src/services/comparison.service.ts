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

import { FinancialPeriod } from "../utils/report-validator";

export function compareFinancialPeriods(
    current: FinancialPeriod,
    previous: FinancialPeriod
): FinancialComparison {

    return {

        revenueGrowth:
            calculateGrowth(
                current.revenue,
                previous.revenue
            ),

        grossProfitGrowth:
            calculateGrowth(
                current.grossProfit,
                previous.grossProfit
            ),

        operatingProfitGrowth:
            calculateGrowth(
                current.operatingProfit,
                previous.operatingProfit
            ),

        ebitdaGrowth:
            calculateGrowth(
                current.ebitda,
                previous.ebitda
            ),

        netProfitGrowth:
            calculateGrowth(
                current.netProfit,
                previous.netProfit
            ),

        cashGrowth:
            calculateGrowth(
                current.cash,
                previous.cash
            ),

        debtGrowth:
            calculateGrowth(
                current.debt,
                previous.debt
            ),

        customerGrowth:
            calculateGrowth(
                current.customers,
                previous.customers
            ),

        netAssetGrowth:
            calculateGrowth(
                current.netAssets,
                previous.netAssets
            )

    };

}

function calculateGrowth(
    current: number | null,
    previous: number | null
): number | null {

    if (
        current === null ||
        previous === null ||
        previous === 0
    ) {
        return null;
    }

    return roundToTwoDecimals(
        ((current - previous) / previous) * 100
    );

}

function roundToTwoDecimals(
    value: number
): number {

    return Math.round(
        (value + Number.EPSILON) * 100
    ) / 100;

}