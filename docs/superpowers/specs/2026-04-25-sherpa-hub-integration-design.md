# Sherpa Hub Integration — Platform-Wide Design

**Date:** 2026-04-25
**Status:** Design Spec
**Owner:** Phyrom (founder)
**Predecessor:** `2026-04-15-sherpa-hub-model-design.md` (Hub model — physical layout, kit catalog, rental fleet, training calendar, inventory data model)
**Sister specs (parallel):** International Expansion, Franchise Model, Platform Scale Architecture
**Abbreviations spelled out on first use:** Point of Sale (POS), Internet of Things (IoT), Limited Liability Company (LLC), Letter of Intent (LOI), Net Promoter Score (NPS), Profit and Loss (P&L), Stock Keeping Unit (SKU), Franchise Disclosure Document (FDD), Franchise Advisory Council (FAC), Headquarters (HQ), Capital Expenditure (capex), Operating Expenditure (opex), Application Programming Interface (API).

---

## 1. Executive Summary

The Sherpa Hub model — a 1,500-3,000 square foot physical pickup point reserved for verified pros — was designed in the April 15 spec as a community-and-amenity layer for Sherpa Pros: will-call kits, equipment rental, training events, lounge. As of that spec, the Hub was a pro-retention play and a moderate revenue line. **The design is complete; nothing is built.** Hub #1 (Atkinson, New Hampshire, colocated at HJD Builders LLC HQ) is slated as the Phase 1 proof point. Phase 2 adds Manchester NH and Portland ME. Phase 3 adds Boston MA and Providence RI. Phase 4 (M18+) opens 10-20 Hubs across the Northeast corridor via franchise.

Between the April 15 spec and today, **Sherpa Materials shipped** (the Wiseman Materials engine plus Zinc API ordering plus Uber Direct delivery — see `src/db/migrations/010_dispatch_materials_orders_deliveries.sql`). That changes everything about why Hubs exist. Pre-Materials, Hubs were a value-add. Post-Materials, **Hubs are the last-mile staging warehouses for a national materials orchestration stack** — without a Hub network, Sherpa Materials runs on direct-to-job-site delivery only, which caps unit economics, kills time-to-job-site, and prevents return processing at scale. The Hub revenue line is no longer member fees plus rentals plus training; it now also includes a per-line gross margin share on every Sherpa Materials item that flows through. This integration spec is necessary now because every operational decision being made at Hub #1 today — staffing model, square-footage allocation, IT stack, pickup counter design, dock door count — must be made with materials throughput as a first-class workload, not an afterthought. It also resolves two open decisions that the original Hub spec deferred (FW Webb partnership path; bundle pricing path) and locks the Hub network rollout timeline against the new materials-throughput thesis.

---

## 2. Hub Status Today (One-Page Summary of the Existing Spec)

The April 15 Hub spec defined the following — all of it stands; this spec layers on top.

- **Physical pickup point** for verified pros only. No clients. No public foot traffic. Badge or keypad access.
- **Footprint:** 1,500-3,000 square feet baseline. April 15 spec used a 3,000 square foot reference layout: 60% warehouse (bulk rack, kit assembly, tool cage, staging), 20% showroom (POS counter, tool demo wall, digital kiosk, pickup window), 20% training (12-seat classroom, demo benches).
- **Staff:** 1 Hub Manager (full-time) plus 1-2 Hub Associates (part-time). Staffing additions for materials throughput defined in §6 of this spec.
- **Services already designed:**
  - Will-call materials and pre-built kits (10 kit categories, retail-vs-Sherpa-pricing locked)
  - Equipment rental (20-tool target catalog: Festool, Hilti, Makita, Milwaukee, SawStop, etc., 60% utilization target, $18K/month rental revenue baseline)
  - Training events (12 events/year, manufacturer-sponsored, $2-5K per event sponsor fee, attendee certifications)
  - Member lounge and informal community space
  - Mini parts inventory (described abstractly in v1; locked to top-200 SKU mini-warehouse in this integration spec)
- **Software modules already specified:** `/api/hub/inventory`, `/api/hub/kits`, `/api/hub/rentals`, `/api/hub/training`, `/api/hub/delivery` plus seven Drizzle/PostgreSQL tables (`hub_kit_templates`, `hub_inventory`, `hub_equipment`, `hub_rentals`, `hub_training_events`, `hub_training_registrations`, `hub_kit_orders`).
- **Hub #1 plan:** Atkinson NH, colocated at HJD Builders LLC HQ. Zero-cost real estate (occupies underutilized HQ warehouse bay). Phase 1 proof point.
- **Status:** Designed. Not built. No real estate fit-out, no hire, no IT install, no inventory ordered. Open decisions noted in v1: FW Webb partnership scope, bundle pricing model, training cadence in mature state, franchise-vs-corporate split. This spec resolves the first three; the fourth defers to the parallel Franchise Model spec.

---

## 3. The Strategic Shift — Hubs as Sherpa Materials Warehouses

Pre-Sherpa-Materials, the Hub thesis was: pros want a place to grab parts, rent a tool they don't own, attend training, hang out, and feel part of a network. Membership fees plus rental margin plus training sponsorship would carry the Hub P&L; the platform got pro-retention lift as the bonus.

Post-Sherpa-Materials, the Hub thesis becomes operationally inseparable from the materials orchestration. Walking through what shipped:

1. A pro accepts a job in the Sherpa Pros marketplace.
2. Wiseman Materials engine (internal name; "Sherpa Materials engine" in customer-facing copy) parses the job scope and emits a materials list with quantities, SKUs, supplier preferences, and timing.
3. The materials orchestration layer places the order via Zinc API to FW Webb / Grainger / supply houses.
4. Until this spec, default delivery was direct-to-job-site via Uber Direct or supplier truck. That works for one-off, but it's expensive ($20-40 per Uber Direct trip, supplier minimums for direct delivery, no consolidation), it's slow (next-day at best), it offers no return path (returns get punted back to suppliers individually), and it scales linearly with cost.

Hubs reorganize that flow. Post-integration, the default delivery path becomes:

1. Wiseman Materials engine emits the list and routes by job geography.
2. If a Hub exists within the job's catchment radius (45-minute drive, configurable), Zinc API ships **to the Hub** instead of to the job site.
3. Hub Manager confirms receipt the night before, stages the materials by job number on a labeled rack.
4. Morning of the job, Uber Direct dispatches **from the Hub** in batched waves (6:30am, 8:00am, 10:00am, 12:00pm) — multiple jobs per wave consolidated by route, dramatically lower per-trip cost.
5. **Or** the pro elects "pickup at Hub" en route to the job site (no Uber Direct trip at all — pure margin).
6. Returns, warranty exchanges, restock — all flow back through the Hub, batched, processed weekly back to suppliers.

The Hub becomes:

- **Last-mile staging warehouse** for Zinc-ordered materials (delivery from FW Webb / Grainger / supply houses to Hub the night before, Uber Direct from Hub to job site morning-of).
- **Backup buffer inventory** for high-frequency parts (a tightly curated mini-warehouse of the top 200 SKUs by network-wide volume, so common items ship same-hour instead of next-day).
- **Material-return processing point** (returns, warranty, restock — batched and reconciled centrally, no per-job overhead).
- **Pro-pickup option** (pro at Hub for any reason can grab their staged materials, eliminating the last-mile delivery cost entirely).

This shift transforms Hub economics. The Hub revenue line is no longer membership fees plus rentals plus training. It's also **materials gross margin per item moved through the Hub** — a brand new revenue stream tied directly to platform job volume and Sherpa Materials adoption rate. §9 of this spec models that economics impact in detail.

---

## 4. FW Webb Partnership Decision (Resolved — Hybrid)

The April 15 Hub spec listed "FW Webb partnership scope" as an open decision. Resolving now.

### Options considered

- **Option A — Own/lease standalone Hubs.** Full control over real estate, brand, layout, hours, staffing. Full capex per Hub ($157K-$257K, see §9). Full opex per Hub ($17K-$21K/month). Hub #1 confirmed as zero-cost real estate via HJD HQ colocation, so Option A's capex burden does not bite at Hub #1 — but it absolutely bites at Hub #2 onward. Standalone is the slowest path to Hub network density.
- **Option B — Co-locate inside FW Webb branches.** FW Webb is a 100-branch Northeast plumbing/HVAC/industrial supply chain (NH, MA, ME, RI, CT, VT, NY, PA, NJ heavily, with stretches into MD, OH, FL). A partnership LOI grants Sherpa a 1,500-2,000 square foot carve-out inside the back of an existing FW Webb branch. Capex drops to ~$80K per Hub (5x lower). Opex drops to ~$14K/month (also lower — sub-leased rent, shared utilities, security overlap). Tradeoff: less brand control (we live inside their building), FW Webb gets deep data flow access (they see what trades order what, when, where), and partnership performance is gated to FW Webb's renewal terms.
- **Option C — Hybrid.** Hub #1 standalone at HJD HQ (Phase 1, proof point). Hubs #2-#10 inside FW Webb branches under partnership pilot (Phase 2-3, accelerated footprint at low capex). Hubs #11+ via franchise per Franchise spec (Phase 4+, Phyrom-doesn't-bear-capex scale).

### Recommendation: Option C

Why hybrid wins:

1. **Hub #1 must prove the standalone model.** If we never operate a standalone Hub, we never know the cost basis of standalone — which means we can never benchmark FW Webb's offer or justify franchise capex. Hub #1 at HJD HQ is the cheapest possible standalone (zero-cost real estate), so we get the operational data without the real-estate burn.
2. **Hubs #2-#10 desperately need low capex.** Hub #2 is the moment we leave the friendly confines of HQ. Standalone Hub #2 in Manchester at $157K capex plus $20K/month opex is a $400K all-in 12-month bet on a single new market. FW Webb co-location at $80K capex plus $14K/month opex is a $250K all-in 12-month bet on the same market. That's a 38% capex reduction at the most fragile moment in the rollout. Take it.
3. **FW Webb wins too.** They get foot-traffic uplift from Sherpa pro members coming into their branches (a real number — Hilti and similar industry references show 12-18% same-store revenue lift from in-store partnerships of this shape), they get anonymized usage data that informs their merchandising, they get a halo on their brand as the "platform of choice for the supply network." Their ask in return: the Sherpa pro discount card honors FW Webb in-branch pricing, and Sherpa Materials defaults FW Webb as the supplier for any SKU FW Webb stocks (a default, not a lock — pros and Wiseman Materials engine can override).
4. **Franchise takes over at scale.** §10 and the parallel Franchise spec cover Phase 4+. The hybrid model is not a multi-year commitment to FW Webb; it's a 5-Hub pilot LOI that we can extend, narrow, or unwind based on partnership performance review.

### Decision deadline

**Hard date:** Phase 1, Month 4. By the end of Hub #1 month four, the FW Webb pilot LOI must be signed (initial 5-Hub pilot agreement). If the LOI is not signed by that date, default to standalone (Option A) for Hubs #2-#3 and revisit FW Webb partnership in Phase 3 from a position of operational strength.

---

## 5. Bundle Pricing Decision (Resolved — Tiered Bundle)

The April 15 Hub spec also listed "bundle pricing" as open. Resolving now.

### Options considered

- **Option A — Hub access included in pro subscription.** Founding Pro $0/month, Gold $49/month, Silver $79/month — all include Hub access (member lounge, kit pickup, training events, mini-inventory will-call). Simpler to market, drives subscription value perception.
- **Option B — Standalone Hub access fee.** A separate $39/month "Hub member" fee, on top of any subscription tier. More complex pricing surface, but isolates Hub revenue cleanly for franchisee P&L purposes (per the Franchise spec's FDD Item 19 economics requirement).
- **Option C — Tiered bundle.** Founding and Gold include Hub access. Silver and Bronze pay a $25/month Hub upgrade. Flex tier (low-bandwidth side-hustle pros) does not have Hub access by default.

### Recommendation: Option C

Why tiered wins:

1. **Top-tier pros get Hub as a benefit.** Founding Pros and Gold subscribers are our highest-value, highest-retention cohort. Including Hub access in their subscription makes the tier more valuable, which drives retention (per April 15 spec, Hub members churn 40% lower than non-members), which is the entire reason Hubs exist as a retention play.
2. **Bottom-tier pros pay an incremental fee that isolates Hub revenue.** Silver and Bronze pay $25/month for Hub upgrade. This number flows cleanly to a franchisee's P&L (vs. Option A's "we'll allocate some fraction of subscription to Hub revenue" which is a finance-team headache). The Franchise spec's FDD Item 19 (per-Hub economics disclosure to prospective franchisees) needs a clean Hub revenue line, and Option C provides it.
3. **Flex tier exclusion keeps Hub experience high quality.** Flex pros are by design low-volume, side-bandwidth — they take 2-3 jobs/month for cash flow, not as a primary income. They are not the target Hub member persona. Excluding them by default keeps the Hub member community concentrated on full-time pros, which preserves the lounge/training community feel and prevents Hub crowding from members who barely use it. Flex pros can opt-in to Hub access for $39/month if they want it (higher than the $25 Silver/Bronze upgrade because we want to discourage casual conversion).

### Pricing surface (final)

| Pro Tier | Monthly Subscription | Hub Access | Hub Upgrade Fee |
|---|---|---|---|
| Founding Pro | $0 (lifetime grandfather) | Included | n/a |
| Gold | $49 | Included | n/a |
| Silver | $79 | Optional | $25/month |
| Bronze | $29 | Optional | $25/month |
| Flex | $0 | Optional | $39/month |

Pricing locks at Phase 2 onward (Hubs #2+). Hub #1 Phase 1 launches with all members free for the first 90 days as a soft-launch promotion.

---

## 6. Operational Runbook

### Daily operations

- **5:00am — Materials staging start.** Hub Manager (or early Associate) opens the warehouse side (not the public-facing showroom). Pulls the night's inbound Zinc/FW Webb deliveries from the receiving dock, scans against the Sherpa Materials staging manifest, builds job-labeled racks for the morning's Uber Direct waves. This is the highest-leverage 90 minutes in the Hub day.
- **6:30am — First Uber Direct wave dispatches.** Earliest job-site arrivals (early-start trades — framing, drywall, masonry).
- **7:00am — Hub opens.** Showroom side opens. Pros can walk in for kit pickup, parts, rentals, casual member-lounge use.
- **8:00am — Second Uber Direct wave.**
- **10:00am — Third Uber Direct wave.** Mid-morning catch-up jobs.
- **12:00pm — Fourth Uber Direct wave.** Last morning-job materials push.
- **Throughout the day — walk-ins, rentals, member lounge, training-event prep.**
- **End of day (5:30pm) — parts inventory check.** Spot count the top-50 highest-velocity SKUs against the system. Trigger reorder for anything below threshold.
- **6:00pm — Hub closes.** No retail or member access after 6pm. Training events (Tuesdays + Thursdays, 6-8pm) get ad-hoc afterhours access via Hub Manager presence.

### Weekly cadence

- **Monday:** Inventory audit (full warehouse cycle count, 1/4 of warehouse per week so full audit completes monthly), supplier reconciliation (match week's deliveries to Zinc invoices), week-ahead training-event prep.
- **Wednesday:** Returns processing batch (week's returns sorted, photographed, RMA-tagged, batched for supplier pickup Friday).
- **Friday:** Supplier pickup of returns, member newsletter draft sent to HQ for review, week's P&L pulled from POS for HQ snapshot.
- **Saturday:** Optional 8am-12pm member open hours (Hub Manager's choice based on member demand; default closed in Phase 1).

### Monthly cadence

- **First Tuesday:** P&L review with HQ Operations (Phyrom present in Phase 1, delegated to Operations Director by Phase 3). Reviews member count + churn, materials throughput + margin, rental utilization, training revenue, capex needs, staffing changes.
- **Mid-month:** Member NPS survey (10 questions, 90-second target, sent via SMS — measured network-wide, with per-Hub breakdown).
- **Last Friday:** Capex review (any equipment needing replacement, any inventory category needing rethink, any IT/security upgrade — Hub Manager submits, HQ approves up to $5K, anything above goes to monthly P&L review).

### Quarterly cadence

- **Quarterly Business Review (QBR):** Corporate Hubs review with HQ Operations + Phyrom. Franchise Hubs review with the FAC plus regional Operations Director (per Franchise spec). Format: 90-minute structured review on Hub financial health, member health, ops health, growth plan for next quarter.
- **Quarterly all-Hub call:** All Hub Managers + HQ Operations. Knowledge sharing, cross-Hub incident debriefs, Sherpa Materials throughput trends, training-event playbook refinements.

### Staffing model

| Role | Phase 1 (Hub #1) | Phase 2-3 (Hubs #2-#5) | Phase 4 (mature) |
|---|---|---|---|
| Hub Manager | 1 FT, salaried + bonus on Hub revenue | 1 FT each | 1 FT each |
| Hub Associate | 1 PT (~25 hr/wk) | 1-2 PT each | 2 PT each |
| Materials Specialist | n/a (Hub Manager covers) | 1 FT added at 800+ line items/month | 1 FT each |

- **Hub Manager** owns the P&L. Salary $58-72K/year (NH/ME) or $65-85K (MA/RI metro) plus quarterly bonus tied to Hub net revenue (target: 8% of net revenue paid quarterly, capped at 25% of base). Recruit from FW Webb branch managers, Lowe's Pro Desk managers, Home Depot Pro Desk managers, and trade-specific supply house counter managers — they have the exact operational profile.
- **Hub Associates** cover counter, kit assembly, rental check-in/check-out, light receiving. $20-26/hr depending on metro.
- **Materials Specialist** added when monthly Sherpa Materials throughput crosses 800 line items. Owns receiving, staging, Uber Direct dispatch coordination, supplier reconciliation, returns batch. $48-60K/year.

### Security playbook

- **Access:** Keypad + member badge for pro entry (after-hours member lounge access tier optional in Phase 3+). All access events logged to `hub_access_log` (new table — see §7).
- **Surveillance:** 8-camera IP setup covering receiving dock, warehouse aisles, tool cage, pickup counter, showroom, training room, building exterior. 30-day retention on cloud, 90-day retention on local NVR. Cameras streamed to Hub Manager mobile dashboard, alerts on after-hours motion.
- **High-value cage:** Tool cage (Hilti, Festool, SawStop fleet) behind locked steel mesh. Key control via Hub Manager + 1 designated Associate. RFID chip on every rental tool, IoT location ping every 4 hours during rental period (catches "I forgot to return it" before it becomes "where is my $3,200 saw").
- **Cash:** Recommend cashless. POS accepts card-only and member-account-charge. If cash is unavoidable (one-off walk-in), end-of-day cash drop into deposit safe, weekly bank pickup. Eliminates daily cash-handling risk.
- **Incident response:** Documented escalation tree (Hub Manager → Operations Director → Phyrom → law enforcement). Quarterly drill on theft response, fire response, medical response.

### Insurance per Hub

| Coverage | Annual Cost |
|---|---|
| General Liability ($2M aggregate / $1M per occurrence) | $1,400 |
| Property (building improvements + inventory + equipment) | $1,100 |
| Business Interruption (90-day) | $400 |
| Crime / Employee Dishonesty | $350 |
| Cyber (POS + member data) | $300 |
| **Total per Hub** | **~$3,550/year** |

Broker engagement: Phase 1 Month 2. Carrier preference: The Hartford or Chubb (both have strong contractor-marketplace policy products). Master policy structure with per-Hub schedules so Hub additions in Phase 2+ are addendums not new policies.

---

## 7. Hub <-> Marketplace Data Flow

Hub operations and the Sherpa Pros marketplace must be tightly coupled but cleanly separated in the data model. The flow:

```
+-------------------+     +-------------------+     +-------------------+
|  Marketplace      | --> | Wiseman Materials | --> | Hub Routing       |
|  Job creation     |     | engine            |     | (which Hub stages |
|                   |     | (materials list)  |     |  this job?)       |
+-------------------+     +-------------------+     +-------------------+
                                                              |
                                                              v
                          +-------------------+     +-------------------+
                          | Uber Direct       | <-- | Hub staging       |
                          | dispatch from Hub |     | (rack by job ID)  |
                          +-------------------+     +-------------------+
                                    |                         ^
                                    v                         |
                          +-------------------+     +-------------------+
                          | Job site          |     | Zinc API order    |
                          | (pro receives)    |     | to FW Webb / etc. |
                          +-------------------+     +-------------------+
```

### Each surface's view

- **Hub Manager dashboard** shows: incoming material orders for next 48 hours (sortable by Uber Direct wave), today's dispatch schedule, member check-ins (current + scheduled training attendees), inventory levels (top-200 SKU heatmap), rental fleet status, returns queue, today's P&L snapshot.
- **Pro mobile app** shows: nearest Hub (with hours, drive time), parts in stock at that Hub (live inventory query), training event calendar, "pickup at Hub" option for any active job, member-perks visibility (lounge access, free coffee, etc.).
- **Marketplace (homeowner-facing)** shows: estimated material delivery window aligned to job timeline. **Zero Hub-side complexity exposed.** The Hub is internal infrastructure — homeowners see "Materials arriving Tuesday morning" not "Materials staged at Hub #2 Manchester for 8am Uber Direct dispatch wave." Hub branding is pro-facing only.

### Data sync architecture

- **Real-time bidirectional** between Hub POS/inventory and Marketplace database (via Drizzle queries against the shared Postgres). No middleware layer; Hub POS is just another writer to the same database.
- **Audit-logged** via Sherpa Guard (the existing audit-log infrastructure — see `src/db/migrations/008_audit_logs.sql`). Every inventory mutation, every member check-in, every materials staging event lands in `audit_logs` with actor, timestamp, before/after diff.
- **Eventual-consistent** for analytics/reporting (per-Hub P&L, NPS, throughput) — a daily denormalized snapshot job runs at 1am into `hub_metrics_daily` for HQ dashboard performance.

### New tables (additions to v1 Hub schema)

```sql
-- Materials staging at the Hub level — links Sherpa Materials orders to Hub workflow
CREATE TABLE hub_materials_staging (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    materials_order_id UUID NOT NULL REFERENCES materials_orders(id),
    job_id          UUID NOT NULL REFERENCES jobs(id),
    pro_id          UUID NOT NULL REFERENCES pros(id),
    expected_at     TIMESTAMPTZ NOT NULL,        -- when supplier delivers to Hub
    received_at     TIMESTAMPTZ,                  -- actual receipt at Hub
    staged_at       TIMESTAMPTZ,                  -- racked + labeled
    rack_location   VARCHAR(20),                   -- "STAGE-12-A" rack id
    dispatch_wave   VARCHAR(20),                   -- "0630" / "0800" / "1000" / "1200" / "PICKUP"
    dispatch_method VARCHAR(15) NOT NULL DEFAULT 'uber_direct'
                    CHECK (dispatch_method IN ('uber_direct','pro_pickup','supplier_direct')),
    dispatched_at   TIMESTAMPTZ,                   -- left the Hub
    delivered_at    TIMESTAMPTZ,                   -- pro confirmed receipt at job
    margin_to_hub_cents INTEGER NOT NULL DEFAULT 0,  -- gross margin share to Hub for this line
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_hub_materials_staging_hub_dispatch ON hub_materials_staging(hub_id, dispatch_wave, expected_at);

-- Hub access log — every badge-in / keypad event for security + member-engagement analytics
CREATE TABLE hub_access_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    pro_id          UUID REFERENCES pros(id),    -- nullable: staff also badge in
    actor_type      VARCHAR(15) NOT NULL CHECK (actor_type IN ('pro','staff','vendor','unknown')),
    access_method   VARCHAR(15) NOT NULL CHECK (access_method IN ('badge','keypad','manual','escort')),
    direction       VARCHAR(5) NOT NULL CHECK (direction IN ('in','out')),
    event_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes           TEXT
);
CREATE INDEX idx_hub_access_log_hub_event ON hub_access_log(hub_id, event_at DESC);

-- Daily denormalized Hub metrics for HQ dashboard
CREATE TABLE hub_metrics_daily (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    metric_date     DATE NOT NULL,
    member_count    INTEGER NOT NULL DEFAULT 0,
    member_checkins INTEGER NOT NULL DEFAULT 0,
    materials_lines INTEGER NOT NULL DEFAULT 0,
    materials_dollar_volume_cents BIGINT NOT NULL DEFAULT 0,
    materials_margin_cents INTEGER NOT NULL DEFAULT 0,
    rentals_active  INTEGER NOT NULL DEFAULT 0,
    rentals_revenue_cents INTEGER NOT NULL DEFAULT 0,
    training_attendees INTEGER NOT NULL DEFAULT 0,
    training_revenue_cents INTEGER NOT NULL DEFAULT 0,
    pickup_by_pro_count INTEGER NOT NULL DEFAULT 0,
    uber_direct_count INTEGER NOT NULL DEFAULT 0,
    on_time_staging_pct DECIMAL(5,2),
    incidents_count INTEGER NOT NULL DEFAULT 0,
    nps_responses   INTEGER NOT NULL DEFAULT 0,
    nps_score       DECIMAL(4,1),
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (hub_id, metric_date)
);
```

### Example Hub Manager dashboard query

```typescript
// src/app/api/hub/dashboard/today/route.ts
import { db } from "@/db";
import { eq, and, gte, lt } from "drizzle-orm";
import { hubMaterialsStaging, hubInventory, hubRentals } from "@/db/drizzle-schema";

export async function GET(request: Request, { params }: { params: { hubId: string } }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [stagingToday, lowStock, activeRentals] = await Promise.all([
    db.select().from(hubMaterialsStaging)
      .where(and(
        eq(hubMaterialsStaging.hubId, params.hubId),
        gte(hubMaterialsStaging.expectedAt, today),
        lt(hubMaterialsStaging.expectedAt, tomorrow)
      ))
      .orderBy(hubMaterialsStaging.dispatchWave),
    db.select().from(hubInventory)
      .where(and(
        eq(hubInventory.hubId, params.hubId),
        // qty_on_hand <= reorder_point
      )),
    db.select().from(hubRentals)
      .where(and(
        eq(hubRentals.hubId, params.hubId),
        // returned_at IS NULL
      ))
  ]);

  return Response.json({ stagingToday, lowStock, activeRentals });
}
```

---

## 8. Hub <-> Sherpa Materials Integration (Core Integration)

This is the integration this spec exists to define.

### Routing rules (Wiseman Materials engine -> Hub)

```
Order placement decision tree:

  for each materials_line in materials_order:
    if line.sku in TOP_200_HIGH_FREQUENCY_SKUS
       and hub_within_radius(job.location, 45_minutes) exists
       and hub.inventory[sku].qty_on_hand >= line.qty:
        # Pull from Hub buffer stock — same-hour fulfillment
        route = "hub_buffer"
        hub = nearest_hub
    elif hub_within_radius(job.location, 45_minutes) exists
         and line.delivery_window > 18_hours_from_now:
        # Stage at Hub the night before, dispatch morning-of
        route = "hub_staged"
        hub = nearest_hub
        zinc_ship_to = hub.shipping_address
    elif line.delivery_window < 6_hours:
        # No time for Hub staging — direct dispatch
        route = "supplier_direct"
        zinc_ship_to = job.location
    else:
        # Default: supplier direct (Hub doesn't make sense for this geography or SKU)
        route = "supplier_direct"
        zinc_ship_to = job.location
```

The Top-200 SKU list is locked quarterly by HQ Operations based on network-wide volume. Phase 1 (Hub #1 only) starts with the top 50 SKUs — buffer-stock ramp grows as throughput data emerges. By Phase 3, the top-200 list is stable and refreshed quarterly based on the prior 90 days of Sherpa Materials line-item demand.

### Hub-side workflow

1. **Inbound delivery (4pm-9pm prior day):** Supplier truck or Zinc-coordinated freight arrives at Hub receiving dock. Hub Materials Specialist (or Hub Manager in Phase 1) scans pallet manifest into POS, reconciles against `hub_materials_staging.expected_at`. Discrepancies flagged immediately — Sherpa Guard logs the variance, HQ Operations notified for reconciliation.
2. **Staging (5am-7am):** Materials pulled from receiving dock to job-labeled racks. Each rack has a printed label with job ID, pro name, dispatch wave, dispatch method. Inventory system updates `hub_materials_staging.staged_at`.
3. **Wave dispatch (6:30am / 8:00am / 10:00am / 12:00pm):** Uber Direct API called from Hub system per wave. Each wave bundles all jobs in the same dispatch window. Hub Associate hands off to Uber Direct driver, scans the rack QR code, system writes `dispatched_at`.
4. **Pro pickup option:** Pro arrives at Hub between 6am-noon, scans member badge, system surfaces any staged materials assigned to them. Pro takes the materials (no Uber Direct trip), system writes `dispatched_at` with `dispatch_method = 'pro_pickup'`. Hub margin per line is **higher** in this case (no Uber Direct cost subtracted).
5. **Returns processing (Wednesday):** Pro returns materials. Hub Materials Specialist scans, photographs, tags RMA, batches with other returns. Friday supplier pickup or scheduled return freight clears the queue. Returns are credited back to Sherpa Materials gross margin pool.

### Hub margin economics on materials throughput

Every line item that flows through a Hub generates a per-line margin share to the Hub.

| Flow type | Hub margin share of gross margin |
|---|---|
| Hub buffer stock (Hub stocked it, Hub fulfilled it) | 40% |
| Hub staged + Uber Direct (Hub received + staged + dispatched) | 25% |
| Hub staged + pro pickup (Hub received + staged, pro picked up) | 35% (no Uber Direct cost) |
| Supplier direct (Hub not involved) | 0% |

**Phase 2 throughput target per Hub:** 800 line items/month at average $20 gross margin per line = $16K monthly gross margin to the Sherpa Materials pool. Hub margin share at a blended ~25% weighted across the flow types = **$1.2K-$2.5K Hub revenue/month** at Phase 2 maturity. That number triples by Phase 4 mature state (~$4-7K/month per Hub).

This is small but meaningful. It does not by itself fund a Hub. It does, paired with member fees + rentals + training, get the Hub above the standalone breakeven line in Year 3. More importantly, it rises with platform-level Sherpa Materials adoption — meaning every Hub becomes more profitable as the rest of the platform grows. That's the right shape of a network-effects revenue line.

---

## 9. Per-Hub Capex / Opex Model

### Capex — one-time per Hub

| Line | Standalone (Option A) | Co-located in FW Webb (Option B) | Franchised (Option C, Phase 4) |
|---|---|---|---|
| Build-out (improvements, finishes, signage interior) | $85K-$185K | $25K | franchisee bears |
| Equipment + IT (POS, racks, security, network) | $35K | $35K | franchisee bears |
| Signage + branding (exterior, wayfinding) | $12K | $5K | franchisee bears |
| Opening inventory (top-200 SKU buffer + kit prebuild) | $25K | $15K | franchisee bears |
| **Total capex** | **$157K-$257K** | **$80K** | **$185K-$420K** (per FDD Item 7) |

Hub #1 capex is dramatically lower because of HJD HQ colocation: ~$60K (build-out reduced to bay refit + flooring + lighting). Documented as the operational baseline for the FDD when franchise development begins.

### Opex — monthly per Hub (corporate)

| Line | Standalone | Co-located (FW Webb) |
|---|---|---|
| Rent | $4K-$8K | $1.5K (sub-lease) |
| Utilities | $800 | $300 |
| Hub Manager (fully-loaded: salary + benefits + bonus accrual + payroll tax) | $7,500 | $7,500 |
| 1.5 Part-Time Associates (avg) | $4,000 | $4,000 |
| Insurance | $300 (~$3,550/year prorated) | $250 |
| Supplies | $400 | $300 |
| Tech (POS subscription, security cloud, internet, member-app fees) | $200 | $200 |
| **Total opex** | **$17,200-$21,200/month** | **$13,750-$14,250/month** |

Materials Specialist (added Phase 2+ once monthly throughput crosses 800 line items) adds ~$4,500/month fully-loaded.

### Revenue per Hub — Year 2 target

| Revenue line | Monthly $ |
|---|---|
| Member fees (60 members at avg $30/month per §5 tiered bundle) | $1,800 |
| Sherpa Materials margin share (Phase 2 throughput target) | $2,000 |
| Equipment rental (60% utilization, blended rate from April 15 spec — pro-rated to a 1-Hub baseline) | $4,500 |
| Training revenue (manufacturer sponsorship + attendee fees, ~2 events/month) | $1,500 |
| Adjacent (lockers, workshop tool rental, member parking, sundries, branded merch) | $800 |
| **Total Year 2 monthly revenue** | **~$10,600/month** |

Note: The April 15 spec's $18K/month rental revenue target assumed 20 tools at the full-fleet rental rate. That number is a Year 3+ mature-Hub target. Year 2 baseline is more conservative ($4,500), reflecting ramp.

### Breakeven analysis

- **Standalone Hub** at $17K-$21K opex, Year 2 revenue ~$10.6K, Year 2 burn $7-10K/month. To reach breakeven cash basis Year 3, need Sherpa Materials throughput uplift of ~$11K/month additional revenue (1,500+ line items/month at Year 3 maturity). Achievable on Phase 4 platform-level growth trajectory but **tight**.
- **Co-located Hub** at $14K opex, Year 2 revenue ~$10.6K, Year 2 burn $3-4K/month. Breakeven Year 2 with modest materials throughput growth. **Significantly better economics.** This is the central reason for the §4 Option C hybrid recommendation.
- **Franchised Hub** — franchisee bears the standalone economics (or better, depending on real estate). Franchisor (Sherpa Pros) earns initial franchise fee + ongoing royalty + tech platform fee + Sherpa Materials margin share at HQ level. Franchisor margin is high; franchisee margin is the franchisee's risk to manage. See Franchise spec for full unit economics modeling.

### Strategic note

Hub economics standalone are tight. **Hub strategic value is multi-dimensional** and cannot be evaluated only on per-Hub P&L:

1. **Pro retention lift** — Hub members churn 40% lower per the April 15 Hub spec. Network-wide retention impact dwarfs per-Hub margin.
2. **Sherpa Materials infrastructure** — the materials orchestration cannot scale without a Hub network. Direct-to-job-site only Sherpa Materials is a ceiling-bound business model. Hub network unlocks the model.
3. **Franchise revenue stream** — Phase 4+ franchise royalties + initial franchise fees become a meaningful HQ revenue line that doesn't appear in any single Hub's P&L.
4. **Brand/community moat** — Hubs are the physical embodiment of "Sherpa Pros is for the trades." That brand moat is hard to replicate by app-only competitors.

**Operating principle:** do not optimize Hubs as standalone P&L. Treat them as platform infrastructure investments that throw off measurable margin and unlock measurable platform-level value.

---

## 10. Franchise-vs-Corporate Hub Decision Matrix per Metro

| Metro tier | Recommended ownership model | Rationale |
|---|---|---|
| **Phase 1-2 launch metros** (Atkinson NH, Manchester NH, Portland ME) | Corporate (with FW Webb co-location for #2-#3) | Need direct operational control to iterate the playbook |
| **Strategic-control metros** (Boston, NYC, Philadelphia, DC) | Corporate or co-located | Brand-flagship presence, regulatory complexity, premium real estate — keep direct control |
| **Pilot-iteration metros** | Corporate | Whenever rolling out a new playbook variation (extended hours, new training format, expanded inventory class) — pilot in corporate Hub first, then push to franchise |
| **Phase 4 outer-Northeast** (Vermont, NY upstate, Western MA, NH/ME secondary cities) | Franchise | Capex risk shifts to franchisee, motivated local operator wins |
| **Phase 4-5 national expansion** | Franchise predominantly, with corporate flagships in top-3 metros | Scale economics demand franchise; reserved corporate flagships for brand presence |
| **FW Webb branch geographies** (Phase 2-3) | Co-located | Lower capex, partnership leverage, faster footprint expansion |

### Per-metro decision flow

```
Decision: which ownership model for Hub in Metro X?

  if Metro X is Phase 1-3 priority and need operational control:
    -> Corporate
  elif Metro X is Phase 4+ expansion and good franchise candidate identified:
    -> Franchise
  elif Metro X is Phase 2-3 and FW Webb branch present and partnership terms acceptable:
    -> Co-locate inside FW Webb
  else:
    -> Defer Hub for Metro X to next planning cycle
```

International expansion (Phase 5+) is out of scope here — defer to International Expansion spec.

---

## 11. Hub Network Rollout Timeline

| Phase | Months | Hubs added | Cumulative | Notes |
|---|---|---|---|---|
| 1 — Proof | 0-6 | Hub #1 Atkinson NH (standalone, corporate, HJD HQ colocation) | 1 | Locked. Real-estate cost zero. Proves the model. |
| 2 — Validate | 6-12 | Hub #2 Manchester NH (FW Webb co-location pilot), Hub #3 Portland ME (standalone, corporate) | 3 | Validates co-location model. Tests two market profiles. |
| 3 — Regional | 12-18 | Hub #4 Boston MA (standalone, corporate, flagship), Hub #5 Providence RI (FW Webb co-location) | 5 | Begins FDD development per Franchise spec. |
| 4 Year 1 — Scale | 18-24 | Hubs #6-#10 across NH/MA/ME/RI/CT (mix: corporate, co-located, first 2 franchised) | 10 | FDD live. First franchisees sign. |
| 4 Year 2 — Saturate | 24-30 | Hubs #11-#20 via franchise + co-location (Northeast corridor full coverage) | 20 | Franchise becomes primary expansion vehicle. |
| 5+ — National + International | 30+ | International master-franchise, national franchise expansion | 50+ | Defer specifics to International Expansion + Franchise specs. |

**Critical-path dates:**

- Hub #1 grand-open: end of Phase 1 Month 6.
- FW Webb pilot LOI signature: end of Phase 1 Month 4.
- FDD draft v1: Phase 2 Month 8.
- FDD ready for first franchisee: end of Phase 3.
- First franchise Hub open: Phase 4 Year 1 Month 22.

---

## 12. Hub Data Telemetry

Every Hub reports weekly to HQ Operations on a fixed dashboard. Same dashboard views are exposed to franchisees for franchise Hubs (per Franchise spec FDD Item 19 disclosure obligations).

### Per-Hub weekly dashboard

| Metric | Source | Owner |
|---|---|---|
| Member count + week-over-week churn | `members` join `hub_member_subscriptions` | Hub Manager |
| Member-job count + revenue | `jobs` filtered by Hub catchment | Hub Manager |
| Materials throughput — line items | `hub_materials_staging` count | Materials Specialist |
| Materials throughput — dollar volume | `hub_materials_staging` sum | Materials Specialist |
| Materials margin to Hub | `hub_materials_staging.margin_to_hub_cents` sum | Materials Specialist |
| Pickup-by-pro / Uber-Direct-from-Hub split | `hub_materials_staging.dispatch_method` group | Materials Specialist |
| Training revenue + attendance | `hub_training_events` join `hub_training_registrations` | Hub Manager |
| Member NPS (rolling 30-day) | `hub_nps_responses` (new table — see Plan WS5) | Hub Manager |
| Local community signal | manual input: PR mentions, supply-house referrals, NHHBA-equivalent local engagement | Hub Manager |
| Operational health | `hub_metrics_daily` aggregations: inventory turnover, return rate, on-time staging rate, security incidents | Materials Specialist + Hub Manager |
| Per-Hub P&L (live) | accounting service join Hub revenue tables | Hub Manager (read), HQ Finance (write) |

### HQ network-wide dashboard

Roll-up across all Hubs:

- Hubs operational vs. in-buildout vs. in-pipeline
- Network-wide member count + churn trend
- Network-wide materials throughput + margin (the integrated platform metric)
- Hub Manager performance ranking (NPS, P&L, materials throughput)
- Capex deployment and remaining annual budget
- Franchise pipeline (FDD inquiries, applications, closings)

### Reporting cadence

- **Daily:** automated denormalized snapshot into `hub_metrics_daily` at 1am.
- **Weekly:** Hub Manager publishes the per-Hub dashboard view to HQ every Friday by 5pm.
- **Monthly:** First Tuesday P&L review (per §6).
- **Quarterly:** QBR (per §6).

---

## 13. Risks + Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| (a) Hub standalone economics underperform | High | High | Bundle pricing per §5 + Sherpa Materials margin share per §8. Standalone Hub Year 3 breakeven assumption depends on materials throughput growth. |
| (b) FW Webb partnership doesn't materialize | High | Medium | Option A standalone fallback. Hub #2 standalone in Manchester is feasible at $400K all-in 12-month bet — uncomfortable but not fatal. |
| (c) Capex over-runs on Hub #1 | Medium | Low | HJD HQ colocation makes Hub #1 capex floor (~$60K). Actual real-estate risk is zero. |
| (d) Hub Manager hiring failure (good ones are scarce) | High | Medium | Recruit from FW Webb / Lowe's Pro Desk / Home Depot Pro Desk / supply house counter managers. Strong candidate pipeline before posting role. |
| (e) Materials throughput slow to scale | Medium | Medium | Phased breakeven assumptions reflect this. Hub #1 Year 1 Sherpa Materials margin share is a small revenue line — Hub does not depend on it. By Phase 3+ it materially contributes. |
| (f) Franchisee misalignment on brand standards | High | Medium | Strong FDD operational standards + FAC oversight (per Franchise spec). Mystery-shopper program quarterly. |
| (g) Cross-Hub competition cannibalization | Medium | Low | Territory protection in FDD. Catchment radius enforced in Wiseman Materials engine routing logic. |
| (h) Inventory shrink + theft | Medium | Medium | Standard retail loss-prevention practices: cycle counts, RFID on rentals, cage on high-value, camera coverage, end-of-day reconciliation. Insurance crime rider. |

---

## 14. Open Decisions Pending After This Spec

1. **Hub #1 grand-open date.** Target: Phase 1 Month 6. Lock specific calendar date by Phase 1 Month 2 (depends on real-estate fit-out timeline at HJD HQ).
2. **FW Webb pilot LOI signature target date.** Hard date Phase 1 Month 4. If LOI not signed by then, default Hub #2-#3 to standalone.
3. **Hub Manager #1 hiring start.** Begin sourcing Phase 1 Month 2. Target offer Phase 1 Month 4. On-floor by Phase 1 Month 5.
4. **Sherpa Materials top-200 SKU list lock.** Phase 1 starts with top 50. Top-200 list locked by HQ Operations end of Phase 2.
5. **Member fee Phase 2 vs. Phase 1 lock.** §5 tiered-bundle pricing applies Phase 2 onward. Hub #1 launches free for first 90 days as soft-launch promotion. Confirm or modify by Phase 1 Month 5.
6. **POS / inventory system selection.** Tradeoff: build on existing Drizzle/Postgres stack vs. integrate a retail POS (Square for Retail, Lightspeed Retail). Recommendation: build on existing stack for Phase 1-2 to control the data model; revisit at Phase 4 scale. Decision lock Phase 1 Month 2.
7. **After-hours member lounge access tier.** Phase 3+ feature — give Founding Pros + Gold the ability to badge into the Hub lounge during after-hours (10pm-6am). High community-value, modest security risk. Defer decision to Phase 3 Month 1.

---

**End of Sherpa Hub Integration spec.**
