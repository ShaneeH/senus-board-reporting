import { PoolClient } from "pg";

import { db } from "../database/db";
import {
    FinancialReport,
    FinancialPeriod
} from "../utils/report-validator";

export class DuplicateDocumentError extends Error {
    constructor() {
        super("This exact PDF has already been uploaded.");
        this.name = "DuplicateDocumentError";
    }
}

export async function saveFinancialDocument(
    documentHash: string,
    openaiFileId: string,
    report: FinancialReport
): Promise<void> {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // Check if this exact document has already been saved
        const existing = await client.query(
            `
            SELECT 1
            FROM documents
            WHERE document_hash = $1
            LIMIT 1;
            `,
            [documentHash]
        );

        if (existing.rowCount) {
            throw new DuplicateDocumentError();
        }

        const companyId = await getOrCreateCompany(
            client,
            report.company
        );

        const documentId = await insertDocument(
            client,
            companyId,
            documentHash,
            openaiFileId,
            report
        );

        for (const period of report.periods) {
            const periodId = await upsertFinancialPeriod(
                client,
                companyId,
                period
            );

            await linkDocumentToPeriod(
                client,
                documentId,
                periodId
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

async function getOrCreateCompany(
    client: PoolClient,
    companyName: string
): Promise<number> {
    const name = companyName.trim();

    const existingCompany = await client.query<{
        company_id: number;
    }>(
        `
        SELECT company_id
        FROM companies
        WHERE LOWER(company_name) = LOWER($1)
        LIMIT 1;
        `,
        [name]
    );

    if (existingCompany.rows.length > 0) {
        return existingCompany.rows[0].company_id;
    }

    const newCompany = await client.query<{
        company_id: number;
    }>(
        `
        INSERT INTO companies (company_name)
        VALUES ($1)
        RETURNING company_id;
        `,
        [name]
    );

    return newCompany.rows[0].company_id;
}

export async function getDocuments() {
  const result = await db.query(`
    SELECT
      id,
      company_id,
      period,
      period_label,
      created_at
    FROM financial_documents
    ORDER BY created_at DESC
  `);

  return result.rows;
}

async function insertDocument(
    client: PoolClient,
    companyId: number,
    documentHash: string,
    openaiFileId: string,
    report: FinancialReport
): Promise<number> {
    const result = await client.query<{
        document_id: number;
    }>(
        `
        INSERT INTO documents (
            company_id,
            document_hash,
            openai_file_id,
            report_name,
            report_type,
            report_date,
            currency,
            source
        )
        VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8
        )
        RETURNING document_id;
        `,
        [
            companyId,
            documentHash,
            openaiFileId,
            report.reportName,
            report.reportType,
            report.reportDate,
            report.currency,
            report.source
        ]
    );

    return result.rows[0].document_id;
}

async function upsertFinancialPeriod(
    client: PoolClient,
    companyId: number,
    period: FinancialPeriod
): Promise<number> {
    const result = await client.query<{
        period_id: number;
    }>(
        `
        INSERT INTO financial_periods (
            company_id,
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
            net_assets
        )
        VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11,
            $12, $13
        )

        ON CONFLICT (company_id, period)
        DO UPDATE SET
            period_end = COALESCE(
                EXCLUDED.period_end,
                financial_periods.period_end
            ),
            period_label = COALESCE(
                EXCLUDED.period_label,
                financial_periods.period_label
            ),
            revenue = COALESCE(
                EXCLUDED.revenue,
                financial_periods.revenue
            ),
            gross_profit = COALESCE(
                EXCLUDED.gross_profit,
                financial_periods.gross_profit
            ),
            operating_profit = COALESCE(
                EXCLUDED.operating_profit,
                financial_periods.operating_profit
            ),
            ebitda = COALESCE(
                EXCLUDED.ebitda,
                financial_periods.ebitda
            ),
            net_profit = COALESCE(
                EXCLUDED.net_profit,
                financial_periods.net_profit
            ),
            cash = COALESCE(
                EXCLUDED.cash,
                financial_periods.cash
            ),
            debt = COALESCE(
                EXCLUDED.debt,
                financial_periods.debt
            ),
            customers = COALESCE(
                EXCLUDED.customers,
                financial_periods.customers
            ),
            net_assets = COALESCE(
                EXCLUDED.net_assets,
                financial_periods.net_assets
            ),
            updated_at = CURRENT_TIMESTAMP

        RETURNING period_id;
        `,
        [
            companyId,
            period.period,
            period.periodEnd,
            period.periodLabel,
            period.revenue,
            period.grossProfit,
            period.operatingProfit,
            period.ebitda,
            period.netProfit,
            period.cash,
            period.debt,
            period.customers,
            period.netAssets
        ]
    );

    return result.rows[0].period_id;
}

async function linkDocumentToPeriod(
    client: PoolClient,
    documentId: number,
    periodId: number
): Promise<void> {
    await client.query(
        `
        INSERT INTO document_periods (
            document_id,
            period_id
        )
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
        `,
        [documentId, periodId]
    );
}

export async function deleteReport(
    client: PoolClient,
    companyId: number,
    period: string
): Promise<boolean> {

    const result = await client.query(
        `
      DELETE FROM reports
      WHERE company_id = $1
      AND period = $2
    `,
        [companyId, period]
    );

    return result.rowCount === 1;
}