import { REPORT_TYPES } from "./report-validator";

const nullableNumber = { type: ["number", "null"] };
const nullableDate = {
    anyOf: [
        { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        { type: "null" }
    ]
};

export const financialReportSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "company",
        "reportName",
        "reportType",
        "reportDate",
        "currency",
        "source",
        "periods"
    ],
    properties: {
        company: { type: "string" },
        reportName: { type: "string" },
        reportType: { type: "string", enum: [...REPORT_TYPES] },
        reportDate: nullableDate,
        currency: {
            anyOf: [
                { type: "string", pattern: "^[A-Z]{3}$" },
                { type: "null" }
            ]
        },
        source: { type: ["string", "null"] },
        periods: {
            type: "array",
            minItems: 1,
            maxItems: 40,
            items: {
                type: "object",
                additionalProperties: false,
                required: [
                    "period",
                    "periodEnd",
                    "periodLabel",
                    "revenue",
                    "grossProfit",
                    "operatingProfit",
                    "ebitda",
                    "netProfit",
                    "cash",
                    "debt",
                    "customers",
                    "netAssets"
                ],
                properties: {
                    period: {
                        type: "string",
                        pattern: "^(?:FY\\d{4}|(?:Q[1-4]|H[12]|YTD|M(?:3|6|9|12))_\\d{4})$"
                    },
                    periodEnd: nullableDate,
                    periodLabel: { type: "string" },
                    revenue: nullableNumber,
                    grossProfit: nullableNumber,
                    operatingProfit: nullableNumber,
                    ebitda: nullableNumber,
                    netProfit: nullableNumber,
                    cash: nullableNumber,
                    debt: nullableNumber,
                    customers: nullableNumber,
                    netAssets: nullableNumber
                }
            }
        }
    }
};
