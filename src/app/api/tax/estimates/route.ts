/**
 * Quarterly Estimated Tax API
 *
 * GET — Get quarterly estimates for a pro's current tax year
 */

import { NextResponse } from "next/server";
import {
  mockQuarterlyEstimates,
  MOCK_PRO_USER_ID,
} from "@/lib/mock-data/tax-data";
import {
  calculateQuarterlyPayment,
  getQuarterlyDeadlines,
  getEstimatedTaxQuarter,
} from "@/lib/services/tax-calculator";

// ---------------------------------------------------------------------------
// GET /api/tax/estimates — quarterly estimate breakdown
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get("proId") || MOCK_PRO_USER_ID;
  const taxYear = parseInt(searchParams.get("year") || "2026", 10);

  // TODO: Replace with DB query + auth check
  const estimates = mockQuarterlyEstimates.filter(
    (e) => e.proId === proId && e.taxYear === taxYear,
  );

  const currentQuarter = getEstimatedTaxQuarter(new Date());
  const deadlines = getQuarterlyDeadlines(taxYear);

  // Calculate live estimate for current quarter based on actual YTD data
  const currentEstimate = estimates.find((e) => e.quarter === currentQuarter);
  let liveCalculation = null;
  if (currentEstimate && currentEstimate.ytdIncomeCents > 0) {
    liveCalculation = calculateQuarterlyPayment(
      currentEstimate.ytdIncomeCents,
      currentEstimate.ytdExpensesCents,
      currentQuarter,
      taxYear,
    );
  }

  const totalPaidCents = estimates
    .filter((e) => e.paymentMade)
    .reduce((sum, e) => sum + (e.paymentAmountCents || 0), 0);

  const nextUnpaid = estimates.find((e) => !e.paymentMade);

  return NextResponse.json({
    data: estimates,
    summary: {
      taxYear,
      currentQuarter,
      totalPaidCents,
      nextDeadline: nextUnpaid?.deadline || null,
      nextEstimatedPaymentCents: nextUnpaid?.totalEstimatedCents
        ? Math.round(nextUnpaid.totalEstimatedCents / 4)
        : null,
      deadlines,
    },
    liveCalculation,
  });
}
