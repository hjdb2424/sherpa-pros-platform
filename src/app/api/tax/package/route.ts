/**
 * Year-End Tax Package API
 *
 * GET  — Retrieve generated tax package for a user/year
 * POST — Generate a new year-end tax package
 */

import { NextResponse } from "next/server";
import {
  mockProTaxOverview,
  mockExpenses,
  mockMileageSummary,
  mockPro1099Records,
  mockW9Profiles,
  MOCK_PRO_USER_ID,
} from "@/lib/mock-data/tax-data";
import { getScheduleCMapping } from "@/lib/services/tax-calculator";

// ---------------------------------------------------------------------------
// GET /api/tax/package — retrieve year-end package
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || MOCK_PRO_USER_ID;
  const taxYear = parseInt(searchParams.get("year") || "2026", 10);
  const role = searchParams.get("role") || "pro";

  // TODO: Replace with DB query + auth check

  // Build a mock package from existing data
  const overview = mockProTaxOverview;
  const w9 = mockW9Profiles.find((p) => p.proId === userId);

  const scheduleCLines = getScheduleCMapping();

  // Group expenses by Schedule C line
  const expensesByLine: Record<string, { line: string; label: string; totalCents: number; items: number }> = {};
  for (const exp of mockExpenses.filter((e) => e.userId === userId && e.taxYear === taxYear)) {
    if (!expensesByLine[exp.scheduleCLine]) {
      const lineInfo = scheduleCLines[exp.scheduleCLine];
      expensesByLine[exp.scheduleCLine] = {
        line: lineInfo?.line || exp.scheduleCLine,
        label: lineInfo?.label || "Other",
        totalCents: 0,
        items: 0,
      };
    }
    expensesByLine[exp.scheduleCLine].totalCents += exp.amountCents;
    expensesByLine[exp.scheduleCLine].items++;
  }

  const packageData = {
    id: crypto.randomUUID(),
    userId,
    taxYear,
    role,
    totalIncomeCents: overview.ytdIncomeCents,
    totalExpensesCents: overview.ytdExpensesCents,
    totalMileageDeductionCents: mockMileageSummary.totalDeductionCents,
    total1099sIssued: overview.num1099sIssued,
    total1099sReceived: overview.num1099sReceived,
    packageData: {
      w9: w9 ? { legalName: w9.legalName, entityType: w9.entityType, tinDisplay: `***-**-${w9.tinLastFour}` } : null,
      income: {
        totalCents: overview.ytdIncomeCents,
        jobsCompleted: overview.jobsCompleted,
        records1099: mockPro1099Records.filter((r) => r.payeeUserId === userId && r.taxYear === taxYear),
      },
      expenses: {
        totalCents: overview.ytdExpensesCents,
        byScheduleCLine: expensesByLine,
      },
      mileage: {
        totalMiles: mockMileageSummary.totalMiles,
        totalDeductionCents: mockMileageSummary.totalDeductionCents,
        trips: mockMileageSummary.tripCount,
      },
      estimatedTax: {
        seTaxCents: overview.estimatedSeTaxCents,
        incomeTaxCents: overview.estimatedIncomeTaxCents,
        totalCents: overview.totalEstimatedTaxCents,
        paidCents: overview.quarterlyPaidCents,
        remainingCents: overview.remainingOwedCents,
      },
    },
    pdfUrl: null, // TODO: Generate PDF
    exportedTo: null,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: packageData });
}

// ---------------------------------------------------------------------------
// POST /api/tax/package — generate year-end package
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, taxYear, role, exportTo } = body;

  if (!userId || !taxYear) {
    return NextResponse.json(
      { error: "Missing required fields: userId, taxYear", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  // TODO: Actually aggregate all data from DB and generate package
  // TODO: Generate PDF if requested
  // TODO: Export to TurboTax/QBO format if requested

  return NextResponse.json({
    data: {
      id: crypto.randomUUID(),
      userId,
      taxYear,
      role: role || "pro",
      status: "generated",
      exportedTo: exportTo || null,
      generatedAt: new Date().toISOString(),
    },
    message: `Year-end tax package generated for ${taxYear}${exportTo ? ` (exported to ${exportTo})` : ""}.`,
  }, { status: 201 });
}
