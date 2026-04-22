import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockMaintenanceSchedules } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/schedules — List recurring maintenance schedules
 * Query params: ?propertyId=...&frequency=...&dueBefore=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId") ?? undefined;
  const frequency = searchParams.get("frequency") ?? undefined;
  const dueBefore = searchParams.get("dueBefore") ?? undefined;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (propertyId) {
      conditions.push(`property_id = $${idx++}`);
      params.push(propertyId);
    }
    if (frequency) {
      conditions.push(`frequency = $${idx++}`);
      params.push(frequency);
    }
    if (dueBefore) {
      conditions.push(`next_due <= $${idx++}`);
      params.push(dueBefore);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM maintenance_schedules ${where} ORDER BY next_due ASC`;

    const schedules = await query(sql, params);
    return NextResponse.json({ schedules });
  } catch {
    let filtered = [...mockMaintenanceSchedules];
    if (propertyId) filtered = filtered.filter((s) => s.property_id === propertyId);
    if (frequency) filtered = filtered.filter((s) => s.frequency === frequency);
    if (dueBefore) filtered = filtered.filter((s) => s.next_due <= dueBefore);

    filtered.sort((a, b) => a.next_due.localeCompare(b.next_due));

    return NextResponse.json({ schedules: filtered, _mock: true });
  }
}

/**
 * POST /api/pm/schedules — Create a recurring maintenance schedule
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.propertyId || !body.title || !body.frequency || !body.nextDue) {
      return NextResponse.json(
        { error: "Missing required fields: propertyId, title, frequency, nextDue" },
        { status: 400 },
      );
    }

    const validFrequencies = ["monthly", "quarterly", "semi_annual", "annual"];
    if (!validFrequencies.includes(body.frequency)) {
      return NextResponse.json(
        { error: `Invalid frequency. Must be one of: ${validFrequencies.join(", ")}` },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO maintenance_schedules
        (property_id, unit_id, title, description, category, frequency,
         next_due, last_completed, estimated_cost_cents, preferred_vendor_id, auto_dispatch)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        body.propertyId,
        body.unitId ?? null,
        body.title,
        body.description ?? null,
        body.category ?? null,
        body.frequency,
        body.nextDue,
        body.lastCompleted ?? null,
        body.estimatedCostCents ?? null,
        body.preferredVendorId ?? null,
        body.autoDispatch ?? false,
      ],
    );

    return NextResponse.json({ schedule: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/schedules] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance schedule" },
      { status: 500 },
    );
  }
}
