/**
 * 1099-NEC Records API
 *
 * GET  — List 1099 records for a user/year (as payer or payee)
 * POST — Generate a 1099 record for a payer/payee pair
 */

import { NextResponse } from "next/server";
import {
  mockPro1099Records,
  mockPm1099Records,
  mockThresholdAlerts,
  MOCK_PRO_USER_ID,
  MOCK_PM_USER_ID,
} from "@/lib/mock-data/tax-data";
import { meets1099Threshold, THRESHOLD_1099_CENTS } from "@/lib/services/tax-calculator";

// ---------------------------------------------------------------------------
// GET /api/tax/1099 — list 1099 records
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || MOCK_PRO_USER_ID;
  const taxYear = parseInt(searchParams.get("year") || "2026", 10);
  const role = searchParams.get("role") || "payee"; // 'payer' (PM/client) or 'payee' (pro)

  // TODO: Replace with DB query + auth check
  let records;
  if (role === "payer") {
    // PM or client viewing 1099s they need to issue
    records = userId === MOCK_PM_USER_ID
      ? mockPm1099Records.filter((r) => r.taxYear === taxYear)
      : mockPro1099Records.filter((r) => r.payerUserId === userId && r.taxYear === taxYear);
  } else {
    // Pro viewing 1099s they receive
    records = mockPro1099Records.filter(
      (r) => r.payeeUserId === userId && r.taxYear === taxYear,
    );
  }

  // Threshold alerts — payers approaching $600
  const alerts = role === "payee"
    ? mockThresholdAlerts
    : [];

  const summary = {
    totalRecords: records.length,
    totalCents: records.reduce((sum, r) => sum + r.totalCents, 0),
    thresholdMetCount: records.filter((r) => r.thresholdMet).length,
    filedCount: records.filter((r) => r.status === "filed").length,
    threshold: THRESHOLD_1099_CENTS,
  };

  return NextResponse.json({
    data: records,
    alerts,
    summary,
    taxYear,
    role,
  });
}

// ---------------------------------------------------------------------------
// POST /api/tax/1099 — generate or update a 1099 record
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json();

  const { payerUserId, payeeUserId, taxYear, totalCents, payerName, payeeName } = body;

  if (!payerUserId || !payeeUserId || !taxYear) {
    return NextResponse.json(
      { error: "Missing required fields: payerUserId, payeeUserId, taxYear", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const thresholdMet = meets1099Threshold(totalCents || 0);

  // TODO: Upsert to database (unique on payer+payee+year)
  // TODO: If threshold newly met, trigger notification

  const record = {
    id: crypto.randomUUID(),
    payerUserId,
    payeeUserId,
    taxYear,
    totalCents: totalCents || 0,
    thresholdMet,
    status: thresholdMet ? "threshold_met" : "tracking",
    payerName: payerName || "Unknown Payer",
    payeeName: payeeName || "Unknown Payee",
    payeeTinLastFour: null,
    generatedAt: thresholdMet ? new Date().toISOString() : null,
    filedAt: null,
    filingReference: null,
    correctionOfId: null,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    data: record,
    message: thresholdMet
      ? `1099-NEC threshold met ($${(totalCents / 100).toFixed(2)} >= $600). Record generated.`
      : `Tracking payments. $${((THRESHOLD_1099_CENTS - totalCents) / 100).toFixed(2)} until 1099 threshold.`,
  }, { status: 201 });
}
