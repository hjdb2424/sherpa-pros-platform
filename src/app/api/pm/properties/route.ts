import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockProperties, mockUnits } from "@/lib/mock-data/pm-data";
import { parsePagination, paginationMeta } from "@/db/config/performance";

/**
 * GET /api/pm/properties — List all properties for a PM user
 * Query params: ?pmUserId=...&propertyType=...&city=...&page=1&limit=25
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pmUserId = searchParams.get("pmUserId") ?? undefined;
  const propertyType = searchParams.get("propertyType") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const { page, limit, offset } = parsePagination(searchParams);

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (pmUserId) {
      conditions.push(`pm_user_id = $${idx++}`);
      params.push(pmUserId);
    }
    if (propertyType) {
      conditions.push(`property_type = $${idx++}`);
      params.push(propertyType);
    }
    if (city) {
      conditions.push(`LOWER(city) = LOWER($${idx++})`);
      params.push(city);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countRows = await query(
      `SELECT COUNT(*) as total FROM properties ${where}`,
      params,
    );
    const total = Number((countRows[0] as Record<string, unknown>)?.total ?? 0);

    // Paginated fetch
    const sql = `SELECT * FROM properties ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    const rows = await query(sql, [...params, limit, offset]);

    // Attach unit summary per property
    const propertyIds = rows.map((r: Record<string, unknown>) => r.id);
    let unitSummary: Record<string, unknown>[] = [];
    if (propertyIds.length > 0) {
      unitSummary = await query(
        `SELECT property_id, COUNT(*) as total_units,
                COUNT(*) FILTER (WHERE status = 'occupied') as occupied_units,
                COUNT(*) FILTER (WHERE status = 'vacant') as vacant_units,
                COUNT(*) FILTER (WHERE status = 'make_ready') as make_ready_units
         FROM units WHERE property_id = ANY($1) GROUP BY property_id`,
        [propertyIds],
      );
    }

    const summaryMap = new Map(
      unitSummary.map((u: Record<string, unknown>) => [u.property_id, u]),
    );

    const properties = rows.map((p: Record<string, unknown>) => ({
      ...p,
      unit_summary: summaryMap.get(p.id) ?? {
        total_units: 0,
        occupied_units: 0,
        vacant_units: 0,
        make_ready_units: 0,
      },
    }));

    return NextResponse.json({
      data: properties,
      pagination: paginationMeta(page, limit, total),
    });
  } catch {
    // Fallback to mock data
    const filtered = mockProperties.filter((p) => {
      if (pmUserId && p.pm_user_id !== pmUserId) return false;
      if (propertyType && p.property_type !== propertyType) return false;
      if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
      return true;
    });

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    const properties = paged.map((p) => {
      const units = mockUnits.filter((u) => u.property_id === p.id);
      return {
        ...p,
        unit_summary: {
          total_units: units.length,
          occupied_units: units.filter((u) => u.status === "occupied").length,
          vacant_units: units.filter((u) => u.status === "vacant").length,
          make_ready_units: units.filter((u) => u.status === "make_ready").length,
        },
      };
    });

    return NextResponse.json({
      data: properties,
      pagination: paginationMeta(page, limit, total),
      _mock: true,
    });
  }
}

/**
 * POST /api/pm/properties — Create a new property
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.pmUserId || !body.name || !body.propertyType) {
      return NextResponse.json(
        { error: "Missing required fields: pmUserId, name, propertyType" },
        { status: 400 },
      );
    }

    const validTypes = [
      "multi_family",
      "commercial",
      "mixed_use",
      "hoa",
      "vacation_rental",
      "senior_living",
    ];
    if (!validTypes.includes(body.propertyType)) {
      return NextResponse.json(
        { error: `Invalid propertyType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    const rows = await query(
      `INSERT INTO properties
        (pm_user_id, name, address, city, state, zip, property_type,
         unit_count, total_sqft, year_built, monthly_budget_cents, reserve_fund_cents)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        body.pmUserId,
        body.name,
        body.address ?? null,
        body.city ?? null,
        body.state ?? null,
        body.zip ?? null,
        body.propertyType,
        body.unitCount ?? 0,
        body.totalSqft ?? null,
        body.yearBuilt ?? null,
        body.monthlyBudgetCents ?? null,
        body.reserveFundCents ?? null,
      ],
    );

    return NextResponse.json({ property: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/properties] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}
