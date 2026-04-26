---
title: Per-Hub P&L Dashboard — Hub Manager Spec
date: 2026-04-25
status: draft
owner: Phyrom + Sherpa Pros engineering
references:
  - /Users/poum/sherpa-pros-platform/docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (§13 Hub spec)
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/05-sherpa-materials-hub-integration-spec.md (§7 SQL schema)
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/07-network-wide-ops-dashboard-spec.md
implementation_stack: Tremor (already in stack per CLAUDE.md) + Drizzle + Sherpa Guard RBAC
---

# Per-Hub P&L Dashboard — Hub Manager Spec

## Audience + access

- **Primary user**: Hub Manager (1 per Hub) — full read + comment, no edit on financial line items
- **Secondary users**: Network Ops, Finance, Founder, Regional VP — all read; Finance can edit reconciliation
- **RBAC** (per Sherpa Guard): role `hub_manager` scoped to `hub_id`; role `network_ops` + above sees all Hubs (cross-Hub view in `07-network-wide-ops-dashboard-spec.md`)

## Views

Three time granularities — single Hub:

1. **Daily** (today + yesterday + last 30 days line)
2. **Weekly** (current week + trailing 12 weeks)
3. **Monthly** (current month + trailing 12 months + YTD)

Toggle in top-right view switcher. Default view = Weekly.

## Top-of-screen header

```
+--------------------------------------------------------------------+
| Sherpa Hub — Plaistow NH | Hub Mgr: {{name}} | Status: ACTIVE      |
| Member count: 87 | NPS (T30d): 62 | This week: $42,180 rev | EBITDA: $7,840 |
+--------------------------------------------------------------------+
```

## Panel layout (3-column, 4-row Tremor grid)

### Row 1 — Member health (3 panels)

```
+-------------------+-------------------+-------------------+
|  ACTIVE MEMBERS   |   MEMBER NPS      |  CHURN RATE T30d  |
|  87 (+5 this wk)  |   62 (target 50)  |  3.4% (target <5%)|
|  [trend sparkline]|   [trend spark]   |  [trend spark]    |
+-------------------+-------------------+-------------------+
```

Source: `members` + `member_visits` + `member_nps_responses` + `hub_metrics_daily`.

### Row 2 — Revenue (3 panels)

```
+-------------------+-------------------+-------------------+
|  MATERIALS REV    |  TRAINING REV     |  MEMBER FEE REV   |
|  $32,400 wk       |  $4,200 wk        |  $5,580 wk        |
|  [stacked bar mode]|  [event-by-event]|  [tier breakdown]  |
+-------------------+-------------------+-------------------+
```

Materials Rev panel shows the 40 / 35 / 25 mode breakdown stacked bar (Buffer / Counter-pickup / Staged-Uber-Direct).

### Row 3 — Costs + EBITDA (3 panels)

```
+-------------------+-------------------+-------------------+
|  HUB COGS         |  HUB OPEX         |  HUB EBITDA       |
|  $24,560 wk       |  $9,780 wk        |  $7,840 wk (18.6%)|
|  [stacked Mat/Lab]|  [stack: rent/staf|  vs target $7,500 |
|                   |   /utl/insur/mkt] |  Trail-12-wk trend|
+-------------------+-------------------+-------------------+
```

EBITDA panel: trail-12-wk trend line + target overlay + breakeven trajectory marker.

### Row 4 — Operations (3 panels)

```
+-------------------+-------------------+-------------------+
|  TOP 10 MEMBERS   |  TOP 20 SKUS      |  OPS QUALITY      |
|  by job volume    |  by velocity      |  Return rate: 2.1%|
|  [sortable list]  |  [sortable list]  |  Uber on-time:97% |
|                   |                   |  Training attend  |
+-------------------+-------------------+-------------------+
```

Top 10 Members table: name, role/trade, jobs T30d, materials spend T30d, NPS-given. Click → member profile.

Top 20 SKUs table: SKU, description, qty T30d, revenue T30d, fulfillment-mode-mix. Click → SKU detail (stocking levels, replenish history).

Ops Quality: 3 KPIs stacked, each with trend sparkline + target overlay.

## Drill-downs

Every panel supports drill-down on click:

- Member panels → list of members → individual member detail
- Revenue panels → transaction list with filters
- Cost panels → GL detail (read-only from Sherpa Finance integration)
- EBITDA panel → variance bridge vs prior period + vs target
- Top-10 / Top-20 → sortable, exportable

## Daily / weekly / monthly view differences

### Daily view

- Today's running totals (live, refresh every 5 min)
- Yesterday's snapshot (final figures)
- Last 30 days line chart for each KPI
- Today's open alerts panel (returns awaiting processing, Uber Direct exceptions, low-stock alerts)

### Weekly view

- Current week running totals
- Trailing 12 weeks bar chart
- Week-over-week % changes
- Member acquisition + churn weekly cohort

### Monthly view

- Current month running totals
- Trailing 12 months bar chart
- Month-over-month + YoY % changes
- Time-to-breakeven projection (extrapolated trajectory based on trailing 12 months)

## Time-to-breakeven trajectory panel (monthly view only)

Special panel in monthly view, full-width above the standard grid:

```
+--------------------------------------------------------------------+
| TIME TO HUB-LEVEL BREAKEVEN                                        |
| Cumulative EBITDA: -$112,400 | Trail 6-mo run-rate EBITDA: $30,200 |
| Projected breakeven: M14 from soft-open (target M18 — 4 mo ahead!) |
| [Cumulative EBITDA line chart with breakeven horizon line]         |
+--------------------------------------------------------------------+
```

## Alerts panel (always visible, top-right)

Bell icon with badge count. Alert types:

- **Critical (red)**: NPS dropped >10 pts week-over-week; on-time delivery <90%; member churn >8%; cycle-count variance >10%
- **Warning (yellow)**: low-stock alerts on Top-20 SKUs; returns >5% of orders; staff overtime >10% of hours
- **Info (blue)**: new member milestones (50/100/200); training event >80% capacity; new top-SKU emerging

## Implementation hints

- Built in **Tremor** (already in stack per `CLAUDE.md`)
- Data layer: **Drizzle** queries to `hub_metrics_daily`, `hub_materials_staging`, `hub_returns`, `hub_access_log` + base `members`, `materials_orders`, `member_visits`
- Charts: Tremor `LineChart`, `BarChart`, `DonutChart`, `Tracker`
- RBAC: **Sherpa Guard** middleware on each route — `hub_manager` role scoped to `hub_id`; `network_ops` + above unscoped
- Live refresh: server-sent events from `materials-orders` + `hub_access_log` insert triggers
- Mobile: dashboard is desktop-first but responsive — Hub Manager can check core KPIs from phone
- Export: every panel supports CSV + PDF export (Tremor + jsPDF)
- Audit: every drill-down view + every export logged to `audit_log` (who, when, what)

## File layout

```
src/app/(hub-manager)/hubs/[hubId]/dashboard/
  page.tsx                  // route + RBAC gate
  components/
    hub-header.tsx          // top header bar
    member-health-row.tsx   // row 1
    revenue-row.tsx         // row 2
    costs-ebitda-row.tsx    // row 3
    operations-row.tsx      // row 4
    breakeven-trajectory.tsx// monthly view only
    alerts-panel.tsx        // floating top-right
  hooks/
    use-hub-metrics.ts      // Drizzle data fetch + cache
    use-hub-realtime.ts     // SSE for live counters
  data/
    fetch-hub-kpis.ts       // server-side data fetchers
```

## Acceptance criteria

- [ ] Hub Manager logged in as `hub_manager` for Hub X sees only Hub X data
- [ ] All KPIs match `hub_metrics_daily` row for the period
- [ ] Drill-downs export within 5 sec for any 12-month range
- [ ] Mobile-responsive top-of-screen header + Row 1 KPIs
- [ ] Live refresh propagates within 60 sec of source insert
- [ ] All alerts route to Hub Manager + Network Ops via Sherpa Notifications
