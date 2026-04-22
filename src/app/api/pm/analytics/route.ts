import { NextResponse } from "next/server";
import { query } from "@/db/connection";
import { mockPmAnalytics } from "@/lib/mock-data/pm-data";

/**
 * GET /api/pm/analytics — Portfolio-level analytics for a PM
 * Query params: ?pmUserId=...&propertyId=... (optional — filter to single property)
 *
 * Returns: NOI, cost/unit, budget variance, occupancy, work order stats, compliance
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pmUserId = searchParams.get("pmUserId") ?? undefined;
  const propertyId = searchParams.get("propertyId") ?? undefined;

  try {
    // Property filter clause
    const propFilter = propertyId
      ? `AND p.id = $2`
      : "";
    const baseParams: unknown[] = pmUserId ? [pmUserId] : [];
    if (propertyId) baseParams.push(propertyId);

    const pmFilter = pmUserId ? `WHERE p.pm_user_id = $1` : "";

    // 1. Property + unit stats
    const propStats = await query(
      `SELECT
         COUNT(DISTINCT p.id) as total_properties,
         COALESCE(SUM(p.unit_count), 0) as total_units,
         COALESCE(SUM(p.monthly_budget_cents), 0) as total_monthly_budget_cents
       FROM properties p
       ${pmFilter} ${propFilter}`,
      baseParams,
    );

    // 2. Unit occupancy
    const unitStats = await query(
      `SELECT
         COUNT(*) as total_units_actual,
         COUNT(*) FILTER (WHERE u.status = 'occupied') as occupied_units,
         COALESCE(SUM(u.monthly_rent_cents), 0) as monthly_gross_rent_cents
       FROM units u
       JOIN properties p ON p.id = u.property_id
       ${pmFilter} ${propFilter}`,
      baseParams,
    );

    // 3. Work order cost and stats (last 30 days)
    const woStats = await query(
      `SELECT
         COUNT(*) FILTER (WHERE wo.status NOT IN ('completed','closed','invoiced')) as open_work_orders,
         COALESCE(SUM(wo.actual_cost_cents) FILTER (WHERE wo.completed_at >= now() - interval '30 days'), 0) as monthly_actual_cost_cents,
         COALESCE(AVG(EXTRACT(epoch FROM (wo.completed_at - wo.created_at)) / 86400)
           FILTER (WHERE wo.completed_at IS NOT NULL AND wo.created_at >= now() - interval '90 days'), 0) as avg_completion_days
       FROM work_orders wo
       JOIN properties p ON p.id = wo.property_id
       ${pmFilter} ${propFilter}`,
      baseParams,
    );

    // 4. Compliance overdue count
    const compStats = await query(
      `SELECT
         COUNT(*) FILTER (WHERE ci.status = 'overdue') as overdue_compliance,
         COUNT(*) FILTER (WHERE ci.status = 'due_soon') as due_soon_compliance
       FROM compliance_items ci
       JOIN properties p ON p.id = ci.property_id
       ${pmFilter} ${propFilter}`,
      baseParams,
    );

    const ps = propStats[0] as Record<string, unknown>;
    const us = unitStats[0] as Record<string, unknown>;
    const ws = woStats[0] as Record<string, unknown>;
    const cs = compStats[0] as Record<string, unknown>;

    const totalUnits = Number(us?.total_units_actual ?? 0);
    const occupiedUnits = Number(us?.occupied_units ?? 0);
    const grossRent = Number(us?.monthly_gross_rent_cents ?? 0);
    const opex = Number(ws?.monthly_actual_cost_cents ?? 0);
    const budget = Number(ps?.total_monthly_budget_cents ?? 0);

    const analytics = {
      total_properties: Number(ps?.total_properties ?? 0),
      total_units: totalUnits,
      occupied_units: occupiedUnits,
      occupancy_rate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 1000) / 10 : 0,
      monthly_gross_rent_cents: grossRent,
      monthly_opex_cents: opex,
      noi_cents: grossRent - opex,
      avg_cost_per_unit_cents: totalUnits > 0 ? Math.round(opex / totalUnits) : 0,
      budget_variance_pct:
        budget > 0 ? Math.round(((opex - budget) / budget) * 1000) / 10 : 0,
      open_work_orders: Number(ws?.open_work_orders ?? 0),
      avg_completion_days: Math.round(Number(ws?.avg_completion_days ?? 0) * 10) / 10,
      overdue_compliance: Number(cs?.overdue_compliance ?? 0),
      due_soon_compliance: Number(cs?.due_soon_compliance ?? 0),
    };

    return NextResponse.json({ analytics });
  } catch {
    return NextResponse.json({ analytics: mockPmAnalytics, _mock: true });
  }
}
