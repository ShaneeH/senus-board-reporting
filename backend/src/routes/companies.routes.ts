import { Router, Request, Response } from "express";
import { getCompanies,getCompanyPeriods,getFinancialPeriod,getCompanyHistory} from "../services/companies.service";

const router = Router();

// Used to stop invalid or absurd company IDs reaching the service layer.
const MAX_COMPANY_ID = 2_147_483_647;

// Keeps period values reasonably short.
const MAX_PERIOD_LENGTH = 32;


// Route helpers

// Express params can sometimes come through as arrays,
// so this makes sure we always work with a single string.
function getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

// Reads and validates the company ID from the URL.
function getCompanyId(req: Request): number | null {
    const value = getParam(req.params.companyId);

    // Only allow normal numeric IDs.
    if (!/^\d+$/.test(value)) return null;

    const companyId = Number(value);

    // Company IDs must be positive and within the database integer range.
    if (companyId < 1 || companyId > MAX_COMPANY_ID) return null;

    return companyId;
}

// Gets the optional comparison period from the query string.
function getComparePeriod(req: Request): string | undefined {
    return typeof req.query.compareTo === "string"
        ? req.query.compareTo
        : undefined;
}

// Period names can contain values such as FY2025, 2025_Q1 or 2025_Q2.
function isValidPeriod(period: string): boolean {
    return (
        period.length > 0 &&
        period.length <= MAX_PERIOD_LENGTH &&
        /^[A-Za-z0-9_-]+$/.test(period)
    );
}


// Response helpers

// Keeps error responses consistent across all company routes.
function sendError(
    res: Response,
    status: number,
    message: string
) {
    return res.status(status).json({
        success: false,
        error: message
    });
}

// Converts unexpected errors into a clean API response.
function handleError(res: Response, error: unknown) {
    const message = error instanceof Error
        ? error.message
        : "Unknown error";

    // Service errors containing "not found" should return a 404.
    const status = /not found/i.test(message) ? 404 : 500;

    return sendError(res, status, message);
}

// Common company ID validation used by multiple routes.
function validateCompanyId(
    req: Request,
    res: Response
): number | null {
    const companyId = getCompanyId(req);

    if (companyId === null) {
        sendError(res, 400, "Invalid company ID.");
        return null;
    }

    return companyId;
}


// GET /
// Returns all companies currently stored in the database.
router.get("/", async (_req, res) => {
    try {
        return res.json(await getCompanies());
    } catch (error) {
        return handleError(res, error);
    }
});


// GET /:companyId/periods
// Returns all available reporting periods for a company.
router.get("/:companyId/periods", async (req, res) => {
    const companyId = validateCompanyId(req, res);

    if (companyId === null) return;

    try {
        const periods = await getCompanyPeriods(companyId);

        if (!periods.length) {
            return sendError(res, 404, "No financial periods found.");
        }

        return res.json(periods);
    } catch (error) {
        return handleError(res, error);
    }
});


// GET /:companyId/periods/:period
// Returns the financial data for one period.
// A compareTo query can also be supplied for period comparisons.
router.get("/:companyId/periods/:period", async (req, res) => {
    const companyId = validateCompanyId(req, res);

    if (companyId === null) return;

    const period = getParam(req.params.period);
    const compareTo = getComparePeriod(req);

    // Make sure the requested period uses the expected format.
    if (!isValidPeriod(period)) {
        return sendError(res, 400, "Invalid period format.");
    }

    // Only validate compareTo if the user actually supplied one.
    if (compareTo && !isValidPeriod(compareTo)) {
        return sendError(res, 400, "Invalid comparison period format.");
    }

    try {
        const financialPeriod = await getFinancialPeriod(
            companyId,
            period,
            compareTo
        );

        if (!financialPeriod) {
            return sendError(res, 404, "Financial period not found.");
        }

        return res.json(financialPeriod);
    } catch (error) {
        return handleError(res, error);
    }
});


// GET /:companyId/history
// Returns the company's historical financial data for charts and trends.
router.get("/:companyId/history", async (req, res) => {
    const companyId = validateCompanyId(req, res);

    if (companyId === null) return;

    try {
        const history = await getCompanyHistory(companyId);

        if (!history.length) {
            return sendError(res, 404, "No company history found.");
        }

        return res.json(history);
    } catch (error) {
        return handleError(res, error);
    }
});


export default router;