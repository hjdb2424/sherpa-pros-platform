---
title: Network-Wide Hub Operations Dashboard — HQ Spec
date: 2026-04-25
status: draft
owner: Phyrom + Sherpa Pros engineering
references:
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/06-per-hub-pl-dashboard-spec.md
  - /Users/poum/sherpa-pros-platform/docs/superpowers/specs/2026-04-25-franchise-model-design.md (franchise pipeline = separate dashboard, referenced but not duplicated)
  - /Users/poum/sherpa-pros-platform/docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (§13 Hub model)
implementation_stack: Tremor + Drizzle + Sherpa Guard
---

# Network-Wide Hub Operations Dashboard

## Audience + access

- **Primary users**: Network Ops team, Founder (Phyrom), CFO, Regional VPs
- **Secondary users**: Board observers (read-only redacted view), FW Webb partnership counterpart (read-only Pilot-Branch-scoped subset, see §6)
- **RBAC** (Sherpa Guard): role `network_ops` + above sees all Hubs unscoped; FW Webb partnership counterpart sees a limited slice

## Top-of-screen rollup band

```
+--------------------------------------------------------------------+
| SHERPA HUB NETWORK | 5 active | 0 soft-open | 0 building | 12 plan |
| Members: 387 active | Materials moved (T30d): $1.42M | Net EBITDA T30d: +$48K |
| Hubs at risk: 1 (Warwick — NPS dip) | Network NPS: 58              |
+--------------------------------------------------------------------+
```

Top band shows the 5 Hub-status counts, network active member count, T30d materials volume, T30d net EBITDA across network, alert summary, network-wide NPS.

## Status definitions

| Status | Meaning |
|---|---|
| **Active** | Hub open, collecting member fees, dispatching jobs, transacting Materials |
| **Soft-open** | Hub physically open but in invitation-only beta with <30 members |
| **Building** | Capex started; not yet operational |
| **Planned** | Identified + LOI / sub-lease in negotiation |

## Section 1 — Per-Hub key metrics summary

A sortable table — **one row per Hub**:

| Hub | Status | Members (active) | T30d Revenue | T30d EBITDA | Materials T30d | NPS | On-time % | Alerts |
|---|---|---|---|---|---|---|---|---|
| Plaistow NH | Active | 87 | $182K | +$32K | $145K | 62 | 97% | 0 |
| Haverhill MA | Active | 91 | $188K | +$28K | $152K | 58 | 96% | 0 |
| Manchester NH | Active | 78 | $164K | +$22K | $128K | 60 | 95% | 1 (low-stock) |
| Woburn MA | Active | 82 | $176K | +$18K | $138K | 56 | 94% | 1 (NPS dip) |
| Warwick RI | Active | 49 | $112K | -$2K | $94K | 47 | 93% | 2 (NPS + churn) |

Sort by any column. Click Hub name → drills into the per-Hub P&L dashboard (`06-per-hub-pl-dashboard-spec.md`).

## Section 2 — Network-wide rollup

Tremor cards stacked across the top of section 2:

```
+------------+------------+------------+------------+------------+
| TOTAL      | TOTAL      | TOTAL NET  | NETWORK    | BREAKEVEN  |
| MEMBERS    | MATERIALS  | REVENUE    | EBITDA     | STATUS     |
| 387 active | $1.42M T30d| $822K T30d | +$98K T30d | 4/5 above  |
| [trend]    | [trend]    | [trend]    | [trend]    | breakeven  |
+------------+------------+------------+------------+------------+
```

Followed by a **Hub-by-Hub breakeven status panel**:

```
Hub             Cumulative EBITDA   Run-rate EBITDA   Projected BE     Status
Plaistow NH     +$84K              +$32K/mo          PASSED M11      ✓ ahead
Haverhill MA    +$62K              +$28K/mo          PASSED M12      ✓ on track
Manchester NH   +$18K              +$22K/mo          PASSED M14      ✓ on track
Woburn MA       -$12K              +$18K/mo          M15             ✓ on track
Warwick RI      -$48K              -$2K/mo           ✗ NEGATIVE      ⚠ at risk
```

## Section 3 — Geographic heat map

Map of New England with each Hub plotted. Marker size = T30d revenue. Marker color = NPS (green/yellow/red).

Hover over Hub → mini-card with key metrics + click-through to per-Hub dashboard.

Layer toggle:

- Hub locations
- FW Webb branch locations (parent network)
- Member density (heat overlay)
- Open jobs (live, last 24 hrs)
- Service area coverage radius per Hub

## Section 4 — Alerts panel

Combined alerts feed across all Hubs. Sortable by severity / Hub / age.

- Any Hub falling **below SLA on dispatch latency** (>15 min from order to driver assigned)
- Any Hub falling **below SLA on member NPS** (>10 pt drop week-over-week)
- Any Hub falling **below SLA on materials on-time rate** (<92% T7d)
- Any Hub with **EBITDA negative for 2+ consecutive weeks**
- Any Hub with **member churn >8% in T30d**
- Any Hub with **cycle-count variance >10%** (loss-prevention escalation)
- Any Hub with **staff overtime >15%** of paid hours (burnout signal)

Each alert has: severity, Hub, metric, value vs threshold, age, assignee, status (open / ack / resolved). Sherpa Notifications routes alerts to Network Ops + Hub Manager + Regional VP based on severity matrix.

## Section 5 — Expansion pipeline

The next 5-10 Hub candidates by stage (NOT to be confused with franchise pipeline — see §6):

| Stage | Count | Examples |
|---|---|---|
| Identified (target market mapped) | 12 | Bedford NH, Portsmouth NH, Westborough MA, Worcester MA, Springfield MA, Cranston RI, Portland ME, Bangor ME, Auburn ME, Lewiston ME, Pittsfield MA, Hyannis MA |
| LOI under negotiation | 0 | (Pilot still in flight) |
| LOI signed, building | 0 | |
| Soft-open | 0 | |

Each candidate row: target market, target FW Webb branch (or alternate host), estimated open date, capex assumption, owner, latest update.

## Section 6 — Franchise leads pipeline (deferred to franchise spec)

This dashboard surfaces a **link out** to the franchise dashboard, not the data itself, because:

- Franchise leads are **FDD-stage prospects** (not company-owned Hubs)
- Franchise dashboard governed by separate spec (`2026-04-25-franchise-model-design.md`)
- Different RBAC scope

Link reads: "Franchise leads pipeline → 8 prospects in qualification, 2 in FDD review (open in franchise dashboard)"

## Section 7 — FW Webb partnership-specific subset

A scoped view available to the FW Webb partnership counterpart (per LOI §6.3):

- Pilot-Branch-only metrics (5 Hubs)
- Aggregate volume figures (no per-member detail)
- Sherpa Materials orchestration volume per Pilot Branch (FW Webb-attributed)
- Branch-foot-traffic uplift (Pilot Branch-level)
- Joint marketing performance (campaign-by-campaign)

This view is **read-only** + **redacted** (no individual member PII, no Sherpa Pros financial detail beyond what LOI §6.3 contemplates).

## Implementation hints

- **Tremor** components: `BarChart`, `LineChart`, `DonutChart`, `AreaChart`, `Card`, `Metric`, `Tracker`
- **Map**: Leaflet + Mapbox tiles (matches Sherpa Pros app stack for member-facing maps)
- **Drizzle** queries to `hubs`, `hub_metrics_daily`, network rollup views
- **Server-sent events** for live KPI counters (top-of-screen band)
- **Caching**: rollups computed nightly to materialized view; live-day uses server-sent event delta from `hub_metrics_daily`
- **RBAC** (Sherpa Guard): role-scoped slices for Network Ops, Founder, Regional VP, FW Webb partner
- **Mobile**: top band + Section 1 + Section 4 are mobile-responsive; map + sections 2-3 are desktop-only

## File layout

```
src/app/(network-ops)/network/
  page.tsx                       // top band + section nav
  hubs/page.tsx                  // section 1 — per-Hub table
  rollup/page.tsx                // section 2 — network rollup
  map/page.tsx                   // section 3 — geo heat map
  alerts/page.tsx                // section 4 — alerts feed
  pipeline/page.tsx              // section 5 — expansion pipeline
  partner-view/[partnerId]/page.tsx  // section 7 — FW Webb scoped slice
  components/
    network-rollup-band.tsx
    per-hub-summary-table.tsx
    breakeven-status-panel.tsx
    network-map.tsx
    alerts-feed.tsx
    expansion-pipeline.tsx
    partner-scoped-view.tsx
  hooks/
    use-network-rollup.ts
    use-hub-alerts.ts
  data/
    fetch-network-kpis.ts
    fetch-partner-scope.ts
```

## Acceptance criteria

- [ ] Network Ops user sees all Hubs unscoped
- [ ] FW Webb partner user sees only Pilot Branches + redacted aggregate
- [ ] Top band updates within 60 sec of source insert
- [ ] Heat map renders all Hubs + 100+ FW Webb branches without perf degradation
- [ ] Alerts panel correctly routes via Sherpa Notifications by severity
- [ ] Breakeven status updates nightly from per-Hub trail-6-mo run-rate
- [ ] All sections support CSV/PDF export
- [ ] Audit log captures all partner-scoped access
