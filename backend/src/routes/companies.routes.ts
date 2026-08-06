import { Router, Request, Response } from "express";
import {
    getCompanies,
    getCompanyPeriods,
    getFinancialPeriod,
    getCompanyHistory
} from "../services/companies.service";

const router = Router();

/** Max company ID we will accept (guards against absurd values / integer overflow tricks). */
const MAX_COMPANY_ID = 2_147_483_647; // 32-bit signed int max

/** Reasonable upper bound for period string length. */
const MAX_PERIOD_LENGTH = 32;

/**
 * Safely extract a single string from Express params (handles string | string[]).
 */
function getParam(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
}

/**
 * Parse & validate companyId from route params.
 * Returns a positive integer or null if invalid.
 */
function parseCompanyId(raw: string): number | null {
    // Reject anything that is not a pure digit string
    // (blocks "1e3", "0x10", leading zeros tricks, etc.)
    if (!/^\d+$/.test(raw)) {
        return null;
    }

    const id = Number(raw);

    if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > MAX_COMPANY_ID
    ) {
        return null;
    }

    return id;
}

/**
 * Basic validation for the period segment.
 * Adjust the regex to match the exact format your API expects
 * (e.g. "2023", "2023-Q1", "FY2024", etc.).
 */
function isValidPeriod(period: string): boolean {
    if (
        typeof period !== "string" ||
        period.length === 0 ||
        period.length > MAX_PERIOD_LENGTH
    ) {
        return false;
    }
    // Allow digits, letters, hyphen and underscore only
    return /^[A-Za-z0-9_-]+$/.test(period);
}

/** Consistent error response helper. */
function sendError(
    res: Response,
    status: number,
    error: string,
    details?: Record<string, unknown>
) {
    return res.status(status).json({
        success: false,
        error,
        ...(details && { details })
    });
}

// GET /

router.get("/", async (_req: Request, res: Response) => {
    try {
        const companies = await getCompanies();

        return res.json({
            success: true,
            data: companies
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        return sendError(res, 500, message);
    }
});


// GET /:companyId/periods

router.get("/:companyId/periods", async (req: Request, res: Response) => {
    try {
        const companyId = parseCompanyId(getParam(req.params.companyId));

        if (companyId === null) {
            return sendError(
                res,
                400,
                "Invalid company ID.",
                {
                    reason:
                        "Company ID must be a positive integer between 1 and " +
                        MAX_COMPANY_ID,
                    received: req.params.companyId
                }
            );
        }

        const periods = await getCompanyPeriods(companyId);

        // If the service returns an empty array for a non-existent company,
        // surface a clear 404 instead of an empty success response.
        if (Array.isArray(periods) && periods.length === 0) {
            return sendError(
                res,
                404,
                `No financial periods found for company ID ${companyId}.`,
                { companyId }
            );
        }

        return res.json({
            success: true,
            data: periods
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        // Honour explicit "not found" messages from the service layer
        const status = /not found/i.test(message) ? 404 : 500;
        return sendError(res, status, message);
    }
});


// GET /:companyId/periods/:period

router.get(
    "/:companyId/periods/:period",
    async (req: Request, res: Response) => {
        try {

            const companyId =
                parseCompanyId(getParam(req.params.companyId));

            if (companyId === null) {
                return sendError(
                    res,
                    400,
                    "Invalid company ID.",
                    {
                        reason:
                            "Company ID must be a positive integer between 1 and " +
                            MAX_COMPANY_ID,
                        received: req.params.companyId
                    }
                );
            }

            const period =
                getParam(req.params.period);

            if (!isValidPeriod(period)) {
                return sendError(
                    res,
                    400,
                    "Invalid period format.",
                    {
                        reason:
                            `Period must be 1–${MAX_PERIOD_LENGTH} characters and contain only letters, digits, hyphen or underscore.`,
                        received: period
                    }
                );
            }

            const compareTo =
                typeof req.query.compareTo === "string"
                    ? req.query.compareTo
                    : undefined;

            if (
                compareTo !== undefined &&
                !isValidPeriod(compareTo)
            ) {
                return sendError(
                    res,
                    400,
                    "Invalid comparison period format.",
                    {
                        reason:
                            `Comparison period must be 1–${MAX_PERIOD_LENGTH} characters and contain only letters, digits, hyphen or underscore.`,
                        received: compareTo
                    }
                );
            }

            const financialPeriod =
                await getFinancialPeriod(
                    companyId,
                    period,
                    compareTo
                );

            if (financialPeriod == null) {
                return sendError(
                    res,
                    404,
                    `Financial data for company ${companyId} and period "${period}" was not found.`,
                    {
                        companyId,
                        period
                    }
                );
            }

            return res.json({
                success: true,
                data: financialPeriod
            });

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown error";

            const status =
                /not found/i.test(message)
                    ? 404
                    : 500;

            return sendError(
                res,
                status,
                message
            );

        }
    }
);

// GET /:companyId/history
router.get("/:companyId/history", async (req: Request, res: Response) => {
    try {
        const companyId = parseCompanyId(getParam(req.params.companyId));

        if (companyId === null) {
            return sendError(
                res,
                400,
                "Invalid company ID.",
                {
                    reason:
                        "Company ID must be a positive integer between 1 and " +
                        MAX_COMPANY_ID,
                    received: req.params.companyId
                }
            );
        }

        const history = await getCompanyHistory(companyId);

        if (Array.isArray(history) && history.length === 0) {
            return sendError(
                res,
                404,
                `No history found for company ID ${companyId}.`,
                { companyId }
            );
        }

        return res.json({
            success: true,
            data: history
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        const status = /not found/i.test(message) ? 404 : 500;
        return sendError(res, status, message);
    }
});

export default router;