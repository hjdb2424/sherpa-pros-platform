/**
 * Mileage Log API
 *
 * GET  — List mileage logs for a pro
 * POST — Add a mileage trip
 */

import { NextResponse } from "next/server";
import {
  mockMileageLogs,
  mockMileageSummary,
  MOCK_PRO_USER_ID,
} from "@/lib/mock-data/tax-data";
import { calculateMileageDeduction } from "@/lib/services/tax-calculator";

// ---------------------------------------------------------------------------
// GET /api/tax/mileage — list mileage logs
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get("proId") || MOCK_PRO_USER_ID;
  const year = searchParams.get("year") || "2026";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // TODO: Replace with DB query + auth check
  const filtered = mockMileageLogs.filter(
    (m) => m.proId === proId && m.date.startsWith(year),
  );

  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginated,
    summary: mockMileageSummary,
    pagination: { limit, offset, total: filtered.length },
    irsRate: { year: parseInt(year), centsPerMile: 67 },
  });
}

// ---------------------------------------------------------------------------
// POST /api/tax/mileage — add a trip
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json();

  const {
    originAddress,
    destinationAddress,
    miles,
    date,
    jobId,
    source,
    isBusiness,
    notes,
  } = body;

  if (!originAddress || !destinationAddress || !miles || !date) {
    return NextResponse.json(
      { error: "Missing required fields: originAddress, destinationAddress, miles, date", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  if (miles <= 0) {
    return NextResponse.json(
      { error: "Miles must be greater than zero", code: "INVALID_MILES" },
      { status: 400 },
    );
  }

  const taxYear = new Date(date).getFullYear();
  const irsRateCents = 67; // 2024 rate
  const deductionCents = calculateMileageDeduction(miles, taxYear);

  // TODO: Save to database via Drizzle
  // TODO: Authenticate request via Clerk

  const trip = {
    id: crypto.randomUUID(),
    proId: body.proId || MOCK_PRO_USER_ID,
    jobId: jobId || null,
    date,
    originAddress,
    destinationAddress,
    miles,
    irsRateCents,
    deductionCents,
    source: source || "manual",
    isBusiness: isBusiness !== false,
    notes: notes || null,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    data: trip,
    message: `Trip logged: ${miles} miles = $${(deductionCents / 100).toFixed(2)} deduction`,
  }, { status: 201 });
}
