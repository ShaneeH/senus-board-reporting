import { PoolClient } from "pg";

import { db } from "../database/db";
import {
    FinancialReport,
    FinancialPeriod
} from "../utils/report-validator";

export class DuplicateReportError extends Error {
    constructor() {
        super("This financial report has already been uploaded.");
        this.name = "DuplicateReportError";
    }
}

export async function saveReport(
    reportId: string,
    report: FinancialReport
): Promise<void> {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        await checkDuplicateReport(client, reportId);

        const companyId = await getOrCreateCompany(
            client,
            report.company
        );

        await insertReport(
            client,
            reportId,
            companyId,
            report
        );

        for (const period of report.periods) {
            await insertFinancialPeriod(
                client,
                reportId,
                period
            );
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function checkDuplicateReport(
    client: PoolClient,
    reportId: string
): Promise<void> {
    const result = await client.query(
        `
        SELECT report_id
        FROM reports
        WHERE report_id = $1
        LIMIT 1;
        `,
        [reportId]
    );

    if ((result.rowCount ?? 0) > 0) {
        throw new DuplicateReportError();
    }
}

async function getOrCreateCompany(
    client: PoolClient,
    companyName: string
): Promise<number> {
    const cleanCompanyName = companyName.trim();

    const existingCompany = await client.query<{
        company_id: number;
    }>(
        `
        SELECT company_id
        FROM companies
        WHERE LOWER(company_name) = LOWER($1)
        LIMIT 1;
        `,
        [cleanCompanyName]
    );

    if ((existingCompany.rowCount ?? 0) > 0) {
        return existingCompany.rows[0].company_id;
    }

    const insertedCompany = await client.query<{
        company_id: number;
    }>(
        `
        INSERT INTO companies (
            company_name
        )
        VALUES ($1)
        RETURNING company_id;
        `,
        [cleanCompanyName]
    );

    return insertedCompany.rows[0].company_id;
}

async function insertReport(
    client: PoolClient,
    reportId: string,
    companyId: number,
    report: FinancialReport
): Promise<void> {
    await client.query(
        `
        INSERT INTO reports (
            report_id,
            company_id,
            report_name,
            report_type,
            report_date,
            currency,
            source,
            summary
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        );
        `,
        [
            reportId,
            companyId,
            report.reportName,
            report.reportType,
            report.reportDate,
            report.currency,
            report.source,
            report.summary
        ]
    );
}

async function insertFinancialPeriod(
    client: PoolClient,
    reportId: string,
    financialPeriod: FinancialPeriod
): Promise<void> {
    await client.query(
        `
        INSERT INTO financial_periods (
            report_id,
            period,
            period_end,
            period_label,
            revenue,
            gross_profit,
            operating_profit,
            ebitda,
            net_profit,
            cash,
            debt,
            customers,
            net_assets,
            summary
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14
        )
        ON CONFLICT (report_id, period)
        DO UPDATE SET
            period_end = EXCLUDED.period_end,
            period_label = EXCLUDED.period_label,
            revenue = EXCLUDED.revenue,
            gross_profit = EXCLUDED.gross_profit,
            operating_profit = EXCLUDED.operating_profit,
            ebitda = EXCLUDED.ebitda,
            net_profit = EXCLUDED.net_profit,
            cash = EXCLUDED.cash,
            debt = EXCLUDED.debt,
            customers = EXCLUDED.customers,
            net_assets = EXCLUDED.net_assets,
            summary = EXCLUDED.summary;
        `,
        [
            reportId,
            financialPeriod.period,
            financialPeriod.periodEnd,
            financialPeriod.periodLabel,
            financialPeriod.revenue,
            financialPeriod.grossProfit,
            financialPeriod.operatingProfit,
            financialPeriod.ebitda,
            financialPeriod.netProfit,
            financialPeriod.cash,
            financialPeriod.debt,
            financialPeriod.customers,
            financialPeriod.netAssets,
            financialPeriod.summary
        ]
    );
}