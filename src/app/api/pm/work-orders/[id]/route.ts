import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockWorkOrders } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/work-orders/[id] — Get work order details
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const rows = await query("SELECT * FROM work_orders WHERE id = $1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }

    return NextResponse.json({ work_order: rows[0] });
  } catch {
    const wo = mockWorkOrders.find((w) => w.id === id);
    if (!wo) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }
    return NextResponse.json({ work_order: wo, _mock: true });
  }
}

/**
 * PATCH /api/pm/work-orders/[id] — Update work order (status, assignment, costs)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const allowedFields: Record<string, string> = {
      unitId: "unit_id",
      assignedProId: "assigned_pro_id",
      title: "title",
      description: "description",
      category: "category",
      priority: "priority",
      status: "status",
      slaHours: "sla_hours",
      budgetCents: "budget_cents",
      actualCostCents: "actual_cost_cents",
      expenseType: "expense_type",
      poNumber: "po_number",
      photos: "photos",
    };

    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const [jsKey, dbCol] of Object.entries(allowedFields)) {
      if (body[jsKey] !== undefined) {
        if (jsKey === "photos") {
          sets.push(`${dbCol} = $${idx++}::jsonb`);
          values.push(JSON.stringify(body[jsKey]));
        } else {
          sets.push(`${dbCol} = $${idx++}`);
          values.push(body[jsKey]);
        }
      }
    }

    // Auto-set timestamp fields based on status changes
    if (body.status === "dispatched") {
      sets.push(`dispatched_at = now()`);
    }
    if (body.status === "completed" || body.status === "closed") {
      sets.push(`completed_at = COALESCE(completed_at, now())`);
    }

    if (sets.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    sets.push(`updated_at = now()`);
    values.push(id);

    const sql = `UPDATE work_orders SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`;
    const rows = await query(sql, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }

    return NextResponse.json({ work_order: rows[0] });
  } catch (error) {
    console.error("[api/pm/work-orders/[id]] PATCH failed:", error);
    return NextResponse.json(
      { error: "Failed to update work order" },
      { status: 500 },
    );
  }
}
