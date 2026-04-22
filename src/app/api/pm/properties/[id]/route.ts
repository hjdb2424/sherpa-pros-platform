import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockProperties, mockUnits, mockWorkOrders } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/properties/[id] — Get property details with units and recent work orders
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const rows = await query("SELECT * FROM properties WHERE id = $1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const units = await query(
      "SELECT * FROM units WHERE property_id = $1 ORDER BY unit_number",
      [id],
    );

    const recentWorkOrders = await query(
      `SELECT * FROM work_orders WHERE property_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [id],
    );

    return NextResponse.json({
      property: rows[0],
      units,
      recent_work_orders: recentWorkOrders,
    });
  } catch {
    // Mock fallback
    const property = mockProperties.find((p) => p.id === id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const units = mockUnits.filter((u) => u.property_id === id);
    const recentWorkOrders = mockWorkOrders
      .filter((wo) => wo.property_id === id)
      .slice(0, 10);

    return NextResponse.json({
      property,
      units,
      recent_work_orders: recentWorkOrders,
      _mock: true,
    });
  }
}

/**
 * PATCH /api/pm/properties/[id] — Update a property
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const allowedFields: Record<string, string> = {
      name: "name",
      address: "address",
      city: "city",
      state: "state",
      zip: "zip",
      propertyType: "property_type",
      unitCount: "unit_count",
      totalSqft: "total_sqft",
      yearBuilt: "year_built",
      monthlyBudgetCents: "monthly_budget_cents",
      reserveFundCents: "reserve_fund_cents",
    };

    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const [jsKey, dbCol] of Object.entries(allowedFields)) {
      if (body[jsKey] !== undefined) {
        sets.push(`${dbCol} = $${idx++}`);
        values.push(body[jsKey]);
      }
    }

    if (sets.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    sets.push(`updated_at = now()`);
    values.push(id);

    const sql = `UPDATE properties SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`;
    const rows = await query(sql, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property: rows[0] });
  } catch (error) {
    console.error("[api/pm/properties/[id]] PATCH failed:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/pm/properties/[id] — Delete a property (cascades to units, work orders)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const rows = await query(
      "DELETE FROM properties WHERE id = $1 RETURNING id",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    console.error("[api/pm/properties/[id]] DELETE failed:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 },
    );
  }
}
