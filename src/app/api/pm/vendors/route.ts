import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockPreferredVendors } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/vendors — List preferred vendors for a PM
 * Query params: ?pmUserId=...&tradeCategory=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pmUserId = searchParams.get("pmUserId") ?? undefined;
  const tradeCategory = searchParams.get("tradeCategory") ?? undefined;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (pmUserId) {
      conditions.push(`pv.pm_user_id = $${idx++}`);
      params.push(pmUserId);
    }
    if (tradeCategory) {
      conditions.push(`pv.trade_category = $${idx++}`);
      params.push(tradeCategory);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT pv.*, p.display_name as pro_name, p.rating_score as pro_rating
      FROM preferred_vendors pv
      LEFT JOIN pros p ON p.id = pv.pro_id
      ${where}
      ORDER BY pv.trade_category, pv.priority_rank`;

    const vendors = await query(sql, params);
    return NextResponse.json({ vendors });
  } catch {
    let filtered = [...mockPreferredVendors];
    if (pmUserId) filtered = filtered.filter((v) => v.pm_user_id === pmUserId);
    if (tradeCategory)
      filtered = filtered.filter((v) => v.trade_category === tradeCategory);

    return NextResponse.json({ vendors: filtered, _mock: true });
  }
}

/**
 * POST /api/pm/vendors — Add a preferred vendor
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.pmUserId || !body.proId || !body.tradeCategory) {
      return NextResponse.json(
        { error: "Missing required fields: pmUserId, proId, tradeCategory" },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO preferred_vendors
        (pm_user_id, pro_id, trade_category, negotiated_rate_cents,
         priority_rank, insurance_verified, insurance_expiry, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        body.pmUserId,
        body.proId,
        body.tradeCategory,
        body.negotiatedRateCents ?? null,
        body.priorityRank ?? 1,
        body.insuranceVerified ?? false,
        body.insuranceExpiry ?? null,
        body.notes ?? null,
      ],
    );

    return NextResponse.json({ vendor: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/vendors] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to add preferred vendor" },
      { status: 500 },
    );
  }
}
