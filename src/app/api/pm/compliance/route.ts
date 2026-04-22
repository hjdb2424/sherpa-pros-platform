import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockComplianceItems } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/compliance — List compliance items
 * Query params: ?propertyId=...&status=...&itemType=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const itemType = searchParams.get("itemType") ?? undefined;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (propertyId) {
      conditions.push(`ci.property_id = $${idx++}`);
      params.push(propertyId);
    }
    if (status) {
      conditions.push(`ci.status = $${idx++}`);
      params.push(status);
    }
    if (itemType) {
      conditions.push(`ci.item_type = $${idx++}`);
      params.push(itemType);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT ci.*, p.name as property_name
      FROM compliance_items ci
      JOIN properties p ON p.id = ci.property_id
      ${where}
      ORDER BY
        CASE ci.status
          WHEN 'overdue' THEN 0
          WHEN 'due_soon' THEN 1
          WHEN 'current' THEN 2
          WHEN 'completed' THEN 3
        END,
        ci.due_date ASC`;

    const items = await query(sql, params);
    return NextResponse.json({ compliance_items: items });
  } catch {
    let filtered = [...mockComplianceItems];
    if (propertyId) filtered = filtered.filter((c) => c.property_id === propertyId);
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (itemType) filtered = filtered.filter((c) => c.item_type === itemType);

    const statusOrder: Record<string, number> = {
      overdue: 0,
      due_soon: 1,
      current: 2,
      completed: 3,
    };
    filtered.sort((a, b) => {
      const sDiff = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
      if (sDiff !== 0) return sDiff;
      return a.due_date.localeCompare(b.due_date);
    });

    return NextResponse.json({ compliance_items: filtered, _mock: true });
  }
}

/**
 * POST /api/pm/compliance — Create a compliance item
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.propertyId || !body.itemType || !body.dueDate) {
      return NextResponse.json(
        { error: "Missing required fields: propertyId, itemType, dueDate" },
        { status: 400 },
      );
    }

    const validTypes = [
      "fire_extinguisher",
      "boiler_inspection",
      "lead_paint",
      "elevator",
      "backflow",
      "fire_alarm",
    ];
    if (!validTypes.includes(body.itemType)) {
      return NextResponse.json(
        { error: `Invalid itemType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO compliance_items
        (property_id, item_type, description, due_date, completed_date,
         status, certificate_url, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        body.propertyId,
        body.itemType,
        body.description ?? null,
        body.dueDate,
        body.completedDate ?? null,
        body.status ?? "current",
        body.certificateUrl ?? null,
        body.notes ?? null,
      ],
    );

    return NextResponse.json({ compliance_item: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/compliance] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create compliance item" },
      { status: 500 },
    );
  }
}
