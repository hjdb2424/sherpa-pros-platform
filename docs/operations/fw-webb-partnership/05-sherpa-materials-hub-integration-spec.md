---
title: Sherpa Materials Engine — Hub-Side Integration Spec (FW Webb Co-Located Hubs)
date: 2026-04-25
status: draft
owner: Phyrom + Sherpa Pros engineering
references:
  - /Users/poum/sherpa-pros-platform/docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (§4 + §13 Hub model)
  - /Users/poum/sherpa-pros-platform/docs/superpowers/plans/2026-04-25-sherpa-hub-integration-plan.md (WS2 + WS3)
  - /Users/poum/sherpa-pros-platform/docs/operations/fw-webb-partnership/03-pilot-loi-template.md (§5 Materials integration)
internal_only: TRUE — never expose "Wiseman" externally; engine is "Sherpa Materials engine" in all customer-facing copy
---

# Sherpa Materials Engine — Hub-Side Integration Spec

## Scope

This spec covers the **Hub-side technical integration** of the Sherpa Materials engine (internally `Wiseman Materials engine`) for the 5 FW Webb co-located Pilot Hubs. It defines:

- Zinc API ship-to-Hub configuration
- Hub inventory management + Marketplace exposure
- Uber Direct dispatch-from-Hub configuration (4 daily waves)
- Pickup-by-pro flow (QR scan + grab + go)
- Return processing
- Per-Hub margin attribution
- SQL schema additions

Out of scope: standalone (non-co-located) Hub variant — see Hub spec §4 Option A.

## 1. Three fulfillment modes per Hub (per Hub spec §13)

Every material order routed through Sherpa Materials engine resolves to **one of three modes** based on SKU class, member preferences, and Hub stocking state:

| Mode | % of Hub volume | Margin to Hub | Latency to pro |
|---|---|---|---|
| **Buffer-stocked** | 40% | High (full Hub markup) | Immediate (pickup or staged) |
| **Counter-pickup** | 35% | Medium (FW Webb counter handoff fee) | Same-day (pro picks at FW Webb counter) |
| **Staged + Uber Direct** | 25% | Lower (Uber Direct fee deduction) | 1-4 hrs to job site |

The orchestrator decision-tree lives in `materials-engine/src/orchestrator/hub-routing.ts` (to be created in WS3).

## 2. Zinc API ship-to-Hub configuration

### 2.1 Default ship-to-Hub for Top-200 SKUs

For each Hub, the Sherpa Materials catalog flags the **Top-200 SKUs** by historical pro-demand velocity in the Hub's catchment region. These SKUs default to `ship_mode = 'hub_buffer'` in the Zinc API call — the engine ships them in case-pack quantities to the Hub on a weekly replenishment cadence.

```ts
// materials-engine/src/zinc/ship-to-hub.ts
export interface HubShipConfig {
  hubId: string;
  fwWebbBranchId: string; // for cross-fulfillment
  shipToAddress: HubAddress;
  defaultShipMode: 'hub_buffer' | 'counter_pickup' | 'job_site';
  bufferStockedSkus: string[]; // top-200 SKUs for this Hub
  replenishCadence: 'weekly' | 'biweekly';
}
```

### 2.2 Routing override

For SKUs **not** in the Top-200, the orchestrator falls through to:

1. FW Webb counter-pickup (if SKU is FW Webb-stocked at the co-located branch)
2. FW Webb staged + Uber Direct (if SKU is FW Webb-stocked + pro chose direct-to-job)
3. Zinc → 3rd-party supplier ship-direct (if SKU is not FW Webb-stocked)

### 2.3 Replenishment trigger

Buffer levels are tracked in `hub_materials_staging` (§7). A nightly cron checks each Hub's Top-200 SKU on-hand vs reorder point and pushes a replenishment PO to FW Webb (via the FW Webb wholesale-order API or EDI 850 — TBD in WS2).

## 3. Hub inventory management

### 3.1 Real-time stocking levels

Hub inventory levels are exposed to the Marketplace pro app:

- Pro requests material → Marketplace queries `hub_materials_staging` → returns `in_stock_at_hub: true | false | low_stock`
- "In stock at Hub" gets a green badge + immediate pickup option
- "Low stock" gets a yellow badge + counter-pickup fallback
- "Not in stock" gets either counter-pickup or Uber Direct option

### 3.2 Cycle counts

Hub Manager performs weekly cycle counts on the Top-50 highest-velocity SKUs and a rolling sample of the rest. Counts are entered via Hub Manager dashboard → updates `hub_materials_staging.qty_on_hand`.

### 3.3 Variance handling

If a cycle count finds variance >5% on any SKU, an alert fires to Hub Manager + Network Ops. Variance investigation is logged in `hub_access_log`.

## 4. Uber Direct dispatch-from-Hub configuration

### 4.1 Four daily waves

Each Hub runs **four daily Uber Direct dispatch waves**:

| Wave | Cutoff time | Pro receives by |
|---|---|---|
| 1 | 6:30 AM | 8:00 AM |
| 2 | 8:00 AM | 9:30 AM |
| 3 | 10:00 AM | 11:30 AM |
| 4 | 12:00 PM | 1:30 PM |

Why 4 waves and not on-demand: Hub Manager batches staging → reduces Uber Direct per-trip cost ~30% via consolidated drop-runs. Pros placing orders after wave-4 cutoff get next-day wave-1.

### 4.2 Wave orchestration

```ts
// materials-engine/src/dispatch/wave-scheduler.ts
export interface DispatchWave {
  hubId: string;
  waveNumber: 1 | 2 | 3 | 4;
  cutoffTime: string; // local TZ
  orders: MaterialsOrder[];
  uberDirectQuoteId?: string;
  uberDirectStatus?: 'quoted' | 'requested' | 'in_transit' | 'delivered' | 'failed';
}
```

### 4.3 Failure handling

If Uber Direct fails for a wave (driver unavailable, etc.), the orchestrator falls back to:

1. Hub Manager personal van delivery (if member is within 5 mi)
2. Reschedule to next wave + auto-credit member $10 inconvenience credit

## 5. Pickup-by-pro flow (QR scan + grab + go)

### 5.1 Flow

1. Pro orders materials in Marketplace app
2. Sherpa Materials engine routes to Hub buffer
3. Hub Manager pre-stages order on labeled shelf (label = pro name + order ID + QR)
4. Pro receives push notification: "Order ready at Hub — show QR at door"
5. Pro arrives at Hub, scans QR at entry kiosk → entry log written to `hub_access_log`
6. Pro walks to labeled shelf, scans QR on order package → completion log written
7. Pro walks out

### 5.2 Loss prevention

- Cameras over each staging shelf (per Hub buildout spec)
- QR scan + camera log = audit trail for any order discrepancy
- Hub access requires active Sherpa Pros member + valid QR (no walk-in pickup without membership)

### 5.3 After-hours pickup

Pilot Hubs offer 24/7 access via member QR for prepaid stocked orders. Buffer-stocked SKUs only — no counter-pickup outside FW Webb branch hours (counter-pickup requires FW Webb staff).

## 6. Return processing

Three return classes, each with a defined flow:

| Class | Flow |
|---|---|
| **Defective** | Pro flags in app → returns to Hub → Hub Manager logs in `hub_returns` table → ships back to Zinc supplier or FW Webb under defective-goods clause → pro credited within 24 hrs |
| **Wrong item** | Pro flags in app → Hub Manager logs + offers same-day correct-item dispatch → wrong item goes back to buffer (if intact) or returned to source |
| **End-of-job remainder** | Pro can return unopened cases for restock credit (50-90% credit depending on SKU) → Hub Manager logs + back to buffer |

All returns log to `hub_returns` (§7).

## 7. Per-Hub margin attribution

Per Hub spec §13, each Hub's P&L tracks margin by mode:

| Mode | Margin model |
|---|---|
| Buffer-stocked | Sherpa Pros markup over Hub-landed cost (incl freight + 8% inventory carry); Hub keeps 100% of markup gross margin |
| Counter-pickup | FW Webb invoices Sherpa Pros at preferred-vendor rate; Sherpa Pros marks up to pro; Hub gets ~$3 per-order handling fee |
| Staged + Uber Direct | Sherpa Pros markup minus Uber Direct fee minus Hub staging labor (~$4/order); margin tighter |

The 40/35/25 mix yields a blended Hub gross margin target of ~22% of materials revenue.

## 8. SQL schema additions

Reference Hub spec §13 — the following tables added to `db/schema/hub-materials.ts`:

```sql
CREATE TABLE hub_materials_staging (
  id UUID PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES hubs(id),
  sku TEXT NOT NULL,
  qty_on_hand INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  reorder_qty INTEGER NOT NULL DEFAULT 0,
  last_replenish_at TIMESTAMPTZ,
  last_cycle_count_at TIMESTAMPTZ,
  cycle_count_variance_pct DECIMAL(5,2),
  is_top_200 BOOLEAN NOT NULL DEFAULT FALSE,
  fw_webb_sku_match TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (hub_id, sku)
);

CREATE TABLE hub_access_log (
  id UUID PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES hubs(id),
  member_id UUID REFERENCES members(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('entry','exit','order_pickup','return_dropoff','staff_admin')),
  related_order_id UUID REFERENCES materials_orders(id),
  qr_scan_payload TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE hub_metrics_daily (
  id UUID PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES hubs(id),
  metric_date DATE NOT NULL,
  active_member_count INTEGER NOT NULL DEFAULT 0,
  member_visits INTEGER NOT NULL DEFAULT 0,
  materials_orders_count INTEGER NOT NULL DEFAULT 0,
  materials_revenue_cents BIGINT NOT NULL DEFAULT 0,
  materials_gross_margin_cents BIGINT NOT NULL DEFAULT 0,
  uber_direct_orders_count INTEGER NOT NULL DEFAULT 0,
  uber_direct_on_time_pct DECIMAL(5,2),
  pickup_orders_count INTEGER NOT NULL DEFAULT 0,
  return_count INTEGER NOT NULL DEFAULT 0,
  member_nps_avg DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (hub_id, metric_date)
);

CREATE TABLE hub_returns (
  id UUID PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES hubs(id),
  order_id UUID REFERENCES materials_orders(id),
  member_id UUID REFERENCES members(id),
  return_class TEXT NOT NULL CHECK (return_class IN ('defective','wrong_item','remainder')),
  sku TEXT NOT NULL,
  qty INTEGER NOT NULL,
  credit_pct INTEGER NOT NULL,
  credit_cents BIGINT NOT NULL,
  return_logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  notes TEXT
);
```

Indexes: `hub_id` on every table; `metric_date` on `hub_metrics_daily`; `member_id, occurred_at` on `hub_access_log`.

## 9. Implementation phasing (aligns with WS3)

| Sub-phase | Weeks | Owner | Deliverable |
|---|---|---|---|
| 9.1 | 1-2 | Eng | Schema migration + Drizzle types |
| 9.2 | 3-4 | Eng | Zinc ship-to-Hub config + Top-200 SKU loader |
| 9.3 | 5-6 | Eng | Hub inventory exposure to Marketplace |
| 9.4 | 7-8 | Eng | Wave scheduler + Uber Direct integration |
| 9.5 | 9-10 | Eng + Hub Mgr | Pickup-by-pro QR flow + access kiosk |
| 9.6 | 11-12 | Eng + Ops | Return processing + Hub Manager dashboard wire-up |
| 9.7 | 13-14 | Eng + Ops | Margin attribution reporting + per-Hub P&L |

## 10. Naming guard

Internal code/comments may reference `wiseman` (the engine's internal name). All **user-facing copy** (Marketplace, Hub Manager dashboard, Hub kiosk, member emails, FW Webb-shared screens) MUST use **"Sherpa Materials"**. CI lint should fail if any string literal containing "wiseman" appears in `src/components/**` or `src/app/(public)/**`.
