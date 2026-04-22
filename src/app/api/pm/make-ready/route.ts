import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockMakeReadies } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/make-ready — List make-readies
 * Query params: ?propertyId=...&status=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (propertyId) {
      conditions.push(`mr.property_id = $${idx++}`);
      params.push(propertyId);
    }
    if (status) {
      conditions.push(`mr.status = $${idx++}`);
      params.push(status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT mr.*, u.unit_number, p.name as property_name
      FROM make_readies mr
      JOIN units u ON u.id = mr.unit_id
      JOIN properties p ON p.id = mr.property_id
      ${where}
      ORDER BY mr.target_ready_date ASC`;

    const makeReadies = await query(sql, params);
    return NextResponse.json({ make_readies: makeReadies });
  } catch {
    let filtered = [...mockMakeReadies];
    if (propertyId) filtered = filtered.filter((mr) => mr.property_id === propertyId);
    if (status) filtered = filtered.filter((mr) => mr.status === status);

    filtered.sort((a, b) => a.target_ready_date.localeCompare(b.target_ready_date));

    return NextResponse.json({ make_readies: filtered, _mock: true });
  }
}

/**
 * POST /api/pm/make-ready — Create a make-ready for a unit
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.unitId || !body.propertyId || !body.vacateDate || !body.targetReadyDate) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: unitId, propertyId, vacateDate, targetReadyDate",
        },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO make_readies
        (unit_id, property_id, vacate_date, target_ready_date, actual_ready_date,
         status, punch_list, total_cost_cents, work_order_ids)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9::jsonb)
       RETURNING *`,
      [
        body.unitId,
        body.propertyId,
        body.vacateDate,
        body.targetReadyDate,
        body.actualReadyDate ?? null,
        body.status ?? "pending",
        JSON.stringify(body.punchList ?? []),
        body.totalCostCents ?? null,
        JSON.stringify(body.workOrderIds ?? []),
      ],
    );

    // Update unit status to make_ready
    await query(
      `UPDATE units SET status = 'make_ready', updated_at = now() WHERE id = $1`,
      [body.unitId],
    );

    return NextResponse.json({ make_ready: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/make-ready] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create make-ready" },
      { status: 500 },
    );
  }
}
