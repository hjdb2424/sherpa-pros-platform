import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockWorkOrders } from "@/lib/mock-data/pm-data";
import { parsePagination, paginationMeta } from "@/db/config/performance";

/**
 * GET /api/pm/work-orders — List work orders with filters
 * Query params: ?pmUserId=...&propertyId=...&status=...&priority=...&category=...&page=1&limit=25
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pmUserId = searchParams.get("pmUserId") ?? undefined;
  const propertyId = searchParams.get("propertyId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const { page, limit, offset } = parsePagination(searchParams);

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (pmUserId) {
      conditions.push(`pm_user_id = $${idx++}`);
      params.push(pmUserId);
    }
    if (propertyId) {
      conditions.push(`property_id = $${idx++}`);
      params.push(propertyId);
    }
    if (status) {
      conditions.push(`status = $${idx++}`);
      params.push(status);
    }
    if (priority) {
      conditions.push(`priority = $${idx++}`);
      params.push(priority);
    }
    if (category) {
      conditions.push(`category = $${idx++}`);
      params.push(category);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    params.push(limit, offset);

    const sql = `SELECT * FROM work_orders ${where}
      ORDER BY
        CASE priority
          WHEN 'emergency' THEN 0
          WHEN 'urgent' THEN 1
          WHEN 'routine' THEN 2
        END,
        created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}`;

    const workOrders = await query(sql, params);

    // Total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM work_orders ${where}`;
    const countRows = await query(countSql, params.slice(0, -2));
    const total = Number((countRows[0] as Record<string, unknown>)?.total ?? 0);

    return NextResponse.json({
      data: workOrders,
      pagination: paginationMeta(page, limit, total),
    });
  } catch {
    // Mock fallback
    let filtered = [...mockWorkOrders];

    if (pmUserId) filtered = filtered.filter((wo) => wo.pm_user_id === pmUserId);
    if (propertyId) filtered = filtered.filter((wo) => wo.property_id === propertyId);
    if (status) filtered = filtered.filter((wo) => wo.status === status);
    if (priority) filtered = filtered.filter((wo) => wo.priority === priority);
    if (category) filtered = filtered.filter((wo) => wo.category === category);

    // Sort: emergency > urgent > routine, then newest first
    const priorityOrder: Record<string, number> = { emergency: 0, urgent: 1, routine: 2 };
    filtered.sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
      if (pDiff !== 0) return pDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data: paged,
      pagination: paginationMeta(page, limit, total),
      _mock: true,
    });
  }
}

/**
 * POST /api/pm/work-orders — Create a new work order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.propertyId || !body.pmUserId || !body.title) {
      return NextResponse.json(
        { error: "Missing required fields: propertyId, pmUserId, title" },
        { status: 400 },
      );
    }

    const validPriorities = ["routine", "urgent", "emergency"];
    const priority = body.priority ?? "routine";
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` },
        { status: 400 },
      );
    }

    // Default SLA based on priority
    const defaultSla: Record<string, number> = {
      emergency: 2,
      urgent: 24,
      routine: 72,
    };

    const rows = await query(
      `INSERT INTO work_orders
        (property_id, unit_id, pm_user_id, tenant_user_id, assigned_pro_id,
         title, description, category, priority, status, sla_hours,
         budget_cents, expense_type, po_number, submitted_by, photos)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [
        body.propertyId,
        body.unitId ?? null,
        body.pmUserId,
        body.tenantUserId ?? null,
        body.assignedProId ?? null,
        body.title,
        body.description ?? null,
        body.category ?? null,
        priority,
        body.status ?? "new",
        body.slaHours ?? defaultSla[priority],
        body.budgetCents ?? null,
        body.expenseType ?? "opex",
        body.poNumber ?? null,
        body.submittedBy ?? "pm",
        JSON.stringify(body.photos ?? []),
      ],
    );

    return NextResponse.json({ work_order: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[api/pm/work-orders] POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create work order" },
      { status: 500 },
    );
  }
}
