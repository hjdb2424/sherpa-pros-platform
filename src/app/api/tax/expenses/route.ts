/**
 * Tax Expenses API
 *
 * GET  — List expenses with category/date/source filters
 * POST — Add a new expense (with auto-categorization)
 */

import { NextResponse } from "next/server";
import {
  mockExpenses,
  MOCK_PRO_USER_ID,
} from "@/lib/mock-data/tax-data";
import {
  categorizeExpense,
  getScheduleCMapping,
} from "@/lib/services/tax-calculator";
import { parsePagination, paginationMeta } from "@/db/config/performance";

// ---------------------------------------------------------------------------
// GET /api/tax/expenses — list expenses with filters
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || MOCK_PRO_USER_ID;
  const taxYear = parseInt(searchParams.get("year") || "2026", 10);
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const { page, limit, offset } = parsePagination(searchParams);

  // TODO: Replace with DB query + auth check
  let filtered = mockExpenses.filter(
    (e) => e.userId === userId && e.taxYear === taxYear,
  );

  if (category) {
    filtered = filtered.filter((e) => e.category === category);
  }
  if (source) {
    filtered = filtered.filter((e) => e.source === source);
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  // Category breakdown
  const byCategory: Record<string, { count: number; totalCents: number }> = {};
  for (const exp of filtered) {
    if (!byCategory[exp.category]) {
      byCategory[exp.category] = { count: 0, totalCents: 0 };
    }
    byCategory[exp.category].count++;
    byCategory[exp.category].totalCents += exp.amountCents;
  }

  const totalCents = filtered.reduce((sum, e) => sum + e.amountCents, 0);

  return NextResponse.json({
    data: paginated,
    summary: {
      totalExpenses: total,
      totalCents,
      byCategory,
    },
    scheduleCMapping: getScheduleCMapping(),
    pagination: paginationMeta(page, limit, total),
    taxYear,
  });
}

// ---------------------------------------------------------------------------
// POST /api/tax/expenses — add expense (with auto-categorization)
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json();

  const {
    description,
    amountCents,
    date,
    category: manualCategory,
    scheduleCLine: manualLine,
    source,
    sourceRefId,
    receiptUrl,
    isDeductible,
  } = body;

  if (!description || !amountCents || !date) {
    return NextResponse.json(
      { error: "Missing required fields: description, amountCents, date", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  if (amountCents < 0) {
    return NextResponse.json(
      { error: "Amount must be positive", code: "INVALID_AMOUNT" },
      { status: 400 },
    );
  }

  // Auto-categorize if not manually specified
  const autoCategory = categorizeExpense(description);
  const finalCategory = manualCategory || autoCategory.category;
  const finalLine = manualLine || autoCategory.scheduleCLine;

  const taxYear = new Date(date).getFullYear();

  // TODO: Save to database via Drizzle
  // TODO: Authenticate request via Clerk

  const expense = {
    id: crypto.randomUUID(),
    userId: body.userId || MOCK_PRO_USER_ID,
    taxYear,
    category: finalCategory,
    scheduleCLine: finalLine,
    description,
    amountCents,
    source: source || "manual",
    sourceRefId: sourceRefId || null,
    receiptUrl: receiptUrl || null,
    isDeductible: isDeductible !== false,
    date,
    createdAt: new Date().toISOString(),
    autoCategorizationUsed: !manualCategory,
    suggestedCategory: autoCategory.category,
    suggestedLine: autoCategory.scheduleCLine,
  };

  return NextResponse.json({
    data: expense,
    message: `Expense added: ${description} ($${(amountCents / 100).toFixed(2)}) → ${finalCategory}`,
  }, { status: 201 });
}
