/**
 * Tax Overview API
 *
 * GET — YTD summary: income, expenses, estimated tax, next deadline, alerts
 */

import { NextResponse } from "next/server";
import {
  mockProTaxOverview,
  mockPmTaxOverview,
  mockThresholdAlerts,
  MOCK_PRO_USER_ID,
  MOCK_PM_USER_ID,
} from "@/lib/mock-data/tax-data";

// ---------------------------------------------------------------------------
// GET /api/tax/overview — YTD tax summary
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || MOCK_PRO_USER_ID;
  const role = searchParams.get("role") || "pro"; // 'pro' | 'pm' | 'client'

  // TODO: Replace with real aggregation queries + auth check

  if (role === "pm") {
    const overview = userId === MOCK_PM_USER_ID
      ? mockPmTaxOverview
      : { ...mockPmTaxOverview, pmId: userId };

    return NextResponse.json({
      data: overview,
      role: "pm",
      alerts: {
        vendorsNeedingW9: overview.vendorsNeedingW9,
        vendorsApproachingThreshold: overview.vendorsApproachingThreshold,
        num1099sToFile: overview.num1099sToFile,
      },
    });
  }

  // Default: Pro overview
  const overview = userId === MOCK_PRO_USER_ID
    ? mockProTaxOverview
    : { ...mockProTaxOverview, proId: userId };

  // Format for dashboard display
  const dashboard = {
    income: {
      ytdCents: overview.ytdIncomeCents,
      ytdFormatted: `$${(overview.ytdIncomeCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      jobsCompleted: overview.jobsCompleted,
    },
    expenses: {
      ytdCents: overview.ytdExpensesCents,
      ytdFormatted: `$${(overview.ytdExpensesCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      mileageDeductionCents: overview.ytdMileageDeductionCents,
    },
    tax: {
      estimatedTotalCents: overview.totalEstimatedTaxCents,
      paidCents: overview.quarterlyPaidCents,
      remainingCents: overview.remainingOwedCents,
      nextDeadline: overview.nextDeadline,
      nextPaymentCents: overview.nextPaymentCents,
    },
    compliance: {
      w9Status: overview.w9Status,
      num1099sReceived: overview.num1099sReceived,
      num1099sIssued: overview.num1099sIssued,
    },
    thresholdAlerts: mockThresholdAlerts,
  };

  return NextResponse.json({
    data: overview,
    dashboard,
    role: "pro",
  });
}
