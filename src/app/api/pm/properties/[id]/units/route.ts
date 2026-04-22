import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockUnits } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/properties/[id]/units — List units for a property
 * Query params: ?status=occupied|vacant|make_ready|offline
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  try {
    const conditions = ["property_id = $1"];
    const values: unknown[] = [id];
    let idx = 2;

    if (status) {
      conditions.push(`status = $${idx++}`);
      values.push(status);
    }

    const sql = `SELECT * FROM units WHERE ${conditions.join(" AND ")} ORDER BY unit_number`;
    const units = await query(sql, values);

    return NextResponse.json({ units });
  } catch {
    const filtered = mockUnits.filter((u) => {
      if (u.property_id !== id) return false;
      if (status && u.status !== status) return false;
      return true;
    });

    return NextResponse.json({ units: filtered, _mock: true });
  }
}

/**
 * POST /api/pm/properties/[id]/units — Create a unit within a property
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    if (!body.unitNumber) {
      return NextResponse.json(
        { error: "Missing required field: unitNumber" },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO units
        (property_id, unit_number, sqft, bedrooms, bathrooms, status,
         tenant_user_id, monthly_rent_cents, lease_start, lease_end)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        id,
        body.unitNumber,
        body.sqft ?? null,
        body.bedrooms ?? null,
        body.bathrooms ?? null,
        body.status ?? "vacant",
        body.tenantUserId ?? null,
        body.monthlyRentCents ?? null,
        body.leaseStart ?? null,
        body.leaseEnd ?? null,
      ],
    );

    // Bump parent property unit_count
    await query(
      `UPDATE properties SET unit_count = (
         SELECT COUNT(*) FROM units WHERE property_id = $1
       ), updated_at = now() WHERE id = $1`,
      [id],
    );

    return NextResponse.json({ unit: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/properties/[id]/units] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 },
    );
  }
}
