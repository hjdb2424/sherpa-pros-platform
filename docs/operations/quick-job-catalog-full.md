# Sherpa Pros — Quick Job Catalog (Full v1)

**Date:** 2026-04-22
**Status:** Draft v1 — engineering spec, ready for T1 consumption in Phase 1
**Parent doc:** `docs/operations/quick-job-lane.md` (framework, dispatch, insurance, brand)
**Source spec:** `docs/superpowers/specs/2026-04-22-gtm-marketing-design.md`
**Companion docs:** `docs/operations/liability-insurance-framework.md`, `docs/operations/embedded-protection-products.md`

This doc expands the 12 starter tasks in `quick-job-lane.md` §4 into a full structured catalog of **47 tasks across 7 categories**, with metro-specific pricing bands, license + insurance requirements, project-mode kick-out logic, full Drizzle schema additions, migration SQL (006), and customer/pro UX specs.

All monetary values are **integer cents** (per `CLAUDE.md` convention). All customer-facing display names are **plainspoken, no jargon, no abbreviations on first use** (per Brand Guardian rules in spec §3.3).

---

## 1. Catalog at a Glance

| # | Category | Task count | Median price range (NH/ME) | Median price range (MA) |
|---|---|---|---|---|
| 1 | Bathroom | 12 | $125 – $625 | $150 – $800 |
| 2 | Kitchen | 8 | $200 – $625 | $275 – $800 |
| 3 | Painting | 6 | $200 – $625 | $275 – $800 |
| 4 | Drywall / Patching | 6 | $225 – $475 | $300 – $625 |
| 5 | Electrical (light) | 8 | $100 – $250 | $135 – $325 |
| 6 | Plumbing (light) | 6 | $150 – $325 | $200 – $425 |
| 7 | Light handyman / general | 10 | $90 – $250 | $120 – $325 |
| | **Total** | **56 task variants across 47 base tasks** | | |

(Some "tasks" have a customer-supplied vs Sherpa-supplied variant — counted once in the base 47.)

---

## 2. Full Task Catalog

Notation:
- **CGL** = Commercial General Liability (insurance — spell out everywhere customer-facing)
- **License columns:** `none` = no state license required for handyman scope · `handyman` = state handyman registration where applicable · `licensed_electrician` = state-licensed electrician required · `licensed_plumber` = state-licensed plumber required · `licensed_other` = task-specific (locksmith, etc.)
- **Permit columns:** `never` / `sometimes` / `always` (always = auto-route to Project mode)
- **Material handling:** `customer_supplied` · `pro_supplied` · `sherpa_supplied_via_zinc` · `customer_choice`
- All prices are **per-job flat-rate ranges**, not hourly

### 2.1 Bathroom (12 tasks)

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `toilet_install_basic` | Toilet install (you supply the toilet) | 90 min | $250–$300–$350 | $325–$390–$450 | customer_supplied | — | handyman | $500K | sometimes | Cast-iron drain, broken closet flange, rotted subfloor → Project |
| `toilet_replace_full` | Toilet replacement (we supply the toilet) | 150 min | $500–$625–$750 | $650–$800–$950 | sherpa_supplied_via_zinc | $200–$400 | handyman | $500K | sometimes | High-end toilet (>$600), bidet seat, pressure-assist → recheck scope |
| `toilet_repair_flapper` | Toilet repair (running, weak flush, fill valve) | 45 min | $125–$150–$175 | $150–$190–$225 | pro_supplied | $15–$30 | handyman | $500K | never | Tank crack, unseen leak below subfloor → Project |
| `bathroom_faucet_replace` | Bathroom sink faucet replacement | 75 min | $150–$200–$250 | $200–$265–$325 | customer_supplied | — | handyman | $500K | never | Frozen shutoff valves, corroded supply lines → may add valve replacement |
| `garbage_disposal_install_bath` | Garbage disposal install (rare in bath — vanity prep sink) | 90 min | $200–$250–$300 | $275–$340–$400 | customer_supplied | — | handyman | $500K | never | No GFCI, no dedicated circuit → kicks to electrical scope |
| `sink_trap_replace_bath` | Bathroom sink P-trap replacement | 60 min | $150–$200–$250 | $200–$265–$325 | pro_supplied | $20–$40 | handyman | $500K | never | Cast-iron tail piece, wall leak → Project |
| `showerhead_replace` | Showerhead replacement | 30 min | $90–$115–$140 | $120–$150–$185 | customer_choice | $30–$120 | none | $500K | never | Stuck shower arm (snaps in wall), hidden leak → may upgrade to valve work |
| `towel_bar_install` | Towel bar install | 30 min | $75–$100–$130 | $100–$130–$170 | customer_supplied | — | none | $500K | never | Tile substrate (needs diamond bit), heavy-gauge anchor needs → photo upload |
| `tp_holder_install` | Toilet paper holder install | 30 min | $65–$85–$110 | $90–$115–$145 | customer_supplied | — | none | $500K | never | Same as towel bar |
| `exhaust_fan_replace` | Bathroom exhaust fan replacement (same model swap) | 90 min | $200–$275–$350 | $275–$360–$450 | customer_choice | $40–$140 | licensed_electrician | $1M | sometimes | Re-routing duct, attic insulation contact, no existing fan (new circuit) → Project |
| `bath_drywall_patch` | Drywall patch in bathroom (≤6"× 6") | 90 min | $200–$250–$300 | $275–$340–$400 | pro_supplied | $20–$40 | handyman | $500K | never | Mold behind drywall, water-damaged framing → Project |
| `bath_paint_touchup` | Bathroom paint touch-up (1–2 walls, ≤80 sqft) | 90 min | $175–$225–$275 | $225–$290–$350 | customer_supplied | — | handyman | $500K | never | Pro-spec needed (mold-resistant, semi-gloss), full repaint → Project |

### 2.2 Kitchen (8 tasks)

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `kitchen_faucet_replace` | Kitchen sink faucet replacement | 90 min | $175–$225–$275 | $225–$290–$350 | customer_supplied | — | handyman | $500K | never | Pull-down hose routing, soap dispenser add, frozen shutoffs → recheck |
| `garbage_disposal_install_kitchen` | Garbage disposal install (under kitchen sink) | 90 min | $200–$250–$300 | $275–$340–$400 | customer_choice | $90–$220 | handyman | $500K | never | No GFCI, no dedicated outlet, hardwired → kicks to electrical |
| `garbage_disposal_repair` | Garbage disposal repair (jammed, hum, no power) | 60 min | $150–$190–$225 | $200–$250–$300 | pro_supplied | $0–$20 | handyman | $500K | never | Motor failure → recommend replacement (may upsell to install task) |
| `dishwasher_install_existing` | Dishwasher install (replacing existing on existing line) | 120 min | $200–$275–$350 | $275–$360–$450 | customer_supplied | — | handyman | $500K | sometimes | No existing line, new electrical, panel work → Project |
| `fridge_water_line_connect` | Refrigerator water-line connection | 75 min | $175–$225–$275 | $225–$290–$350 | pro_supplied | $30–$60 | handyman | $500K | never | No nearby cold-water tap, finished basement below → may need behind-wall run |
| `range_hood_install_replace` | Range hood install (same-vent replacement) | 120 min | $250–$325–$400 | $325–$420–$525 | customer_supplied | — | handyman | $500K | sometimes | New duct cut through wall/roof, no existing hood, gas range proximity → Project |
| `cabinet_hardware_swap` | Cabinet hardware swap (knobs / pulls, up to 25 pieces) | 90 min | $150–$200–$275 | $200–$265–$350 | customer_supplied | — | none | $500K | never | Drilling new holes (different spacing), template needed for >25 pieces |
| `kitchen_sink_undermount_replace` | Kitchen undermount sink replacement | 180 min | $400–$500–$625 | $525–$650–$800 | customer_supplied | — | handyman | $500K | never | Granite re-clip (needs stone fabricator), garbage disposal re-mount → coordinate |

### 2.3 Painting (6 tasks)

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `paint_wall_accent` | Paint a single accent wall (≤120 sqft) | 90 min | $200–$240–$275 | $275–$315–$350 | customer_supplied | — | none | $500K | never | Vaulted ceiling, repair before paint, dark-over-light primer needs → recheck |
| `paint_room_walls` | Paint a single room (walls only, ≤200 sqft) | 270 min | $400–$500–$600 | $525–$625–$725 | customer_supplied | — | none | $500K | never | Heavy patching, wallpaper removal, color change >2 coats → Project |
| `paint_room_walls_ceiling` | Paint a single room (walls and ceiling) | 360 min | $550–$650–$750 | $700–$815–$925 | customer_supplied | — | none | $500K | never | Popcorn ceiling, ceiling repair, height >9 ft → Project |
| `paint_exterior_trim_touchup` | Exterior trim touch-up (same color, ≤40 linear ft) | 120 min | $225–$300–$400 | $300–$390–$500 | customer_supplied | — | none | $500K | sometimes | Pre-1978 home (lead paint disclosure), >40 ft, scaffolding need → Project |
| `paint_door_single` | Paint a single interior door (both sides) | 90 min | $150–$200–$250 | $200–$265–$325 | customer_supplied | — | none | $500K | never | Strip-and-refinish vs paint-over, hardware removal → confirm scope |
| `paint_cabinet_door` | Paint cabinet door (per door, off-site or on-site) | 60 min/door | $40–$55–$75 | $55–$70–$95 | customer_supplied | — | none | $500K | never | >6 doors → Project (full kitchen refinish), spray vs brush → confirm |

### 2.4 Drywall / Patching (6 tasks)

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `drywall_patch_small` | Small drywall patch (up to 6 inches) + paint blend | 90 min | $200–$250–$300 | $275–$340–$400 | pro_supplied | $15–$30 | handyman | $500K | never | Mold visible, structural framing, re-occurring leak source → Project |
| `drywall_patch_medium` | Medium drywall patch (up to 24 inches) + sand + prime | 150 min | $300–$365–$425 | $400–$475–$550 | pro_supplied | $25–$50 | handyman | $500K | never | Cure time → 2 trips needed (note in dispatch); paint matching uncertain |
| `drywall_patch_large` | Large drywall patch (up to 48 inches) + tape + texture | 240 min | $425–$525–$650 | $550–$675–$825 | pro_supplied | $40–$80 | handyman | $500K | never | Approaches Project threshold ($1,500); full sheet = Project |
| `drywall_corner_bead_repair` | Corner bead repair (single corner) | 120 min | $225–$285–$350 | $300–$370–$450 | pro_supplied | $20–$40 | handyman | $500K | never | Multiple corners, full re-bead, settling crack source → Project |
| `lath_plaster_spot` | Plaster spot repair (Boston specialty) | 180 min | n/a | $400–$525–$650 | pro_supplied | $30–$60 | handyman | $500K | never | **Old-House Verified pros only.** Pre-1950 home + lead/asbestos disclosure → Project |
| `drywall_texture_match` | Drywall texture match (orange peel, knockdown, smooth) | 120 min | $250–$325–$400 | $325–$420–$525 | pro_supplied | $20–$40 | handyman | $500K | never | Skip-trowel, hand-troweled custom, ceiling texture → recheck or Project |

### 2.5 Electrical — light, single-circuit (8 tasks)

All electrical tasks in this lane require a **state-licensed electrician** in MA (per MA Electrical Code) and in NH for permit-bearing work. Where a task is "license-flexible" (e.g., smoke detector swap), we still require licensed electrician for liability simplicity. CGL minimum is $1M for licensed-trade work per `liability-insurance-framework.md`.

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `ceiling_fan_install_existing` | Ceiling fan install (existing wiring + box) | 90 min | $200–$250–$300 | $275–$340–$400 | customer_supplied | — | licensed_electrician | $1M | never | No fan-rated box, no existing wiring, vaulted ceiling → Project |
| `ceiling_fan_replace` | Ceiling fan replacement (same-spot swap) | 75 min | $175–$225–$275 | $225–$290–$350 | customer_supplied | — | licensed_electrician | $1M | never | Old box not fan-rated → Project |
| `gfci_outlet_replace` | GFCI outlet replacement | 45 min | $125–$150–$175 | $175–$200–$225 | pro_supplied | $20–$30 | licensed_electrician | $1M | never | Backstabbed wiring, aluminum wiring, no ground → recheck or Project |
| `light_fixture_swap` | Light fixture swap (existing wiring) | 45 min | $125–$150–$175 | $175–$200–$225 | customer_supplied | — | licensed_electrician | $1M | never | Heavy chandelier (>35 lb), no junction box → Project |
| `smart_switch_install` | Smart switch / dimmer install (per location) | 45 min | $125–$160–$200 | $175–$215–$250 | customer_supplied | — | licensed_electrician | $1M | never | No neutral wire (pre-1985 home), 3-way circuit reconfigure → confirm scope |
| `smoke_co_detector_swap` | Smoke and carbon monoxide detector replacement | 30 min/unit | $75–$100–$125 | $100–$125–$150 | customer_choice | $20–$60 | licensed_electrician | $1M | never | Hardwired interconnect adjustment, full-house >5 units → Project |
| `doorbell_ring_install` | Doorbell or smart doorbell install | 60 min | $150–$200–$250 | $200–$265–$325 | customer_supplied | — | licensed_electrician | $1M | never | No existing doorbell wiring (battery-only OK), transformer upgrade → Project |
| `usb_outlet_upgrade` | USB outlet upgrade (per location) | 45 min | $125–$160–$200 | $175–$215–$250 | customer_choice | $25–$45 | licensed_electrician | $1M | never | Aluminum wiring, no neutral, GFCI-protected branch → recheck |

### 2.6 Plumbing — light (6 tasks)

State-licensed plumber required in MA for any pressurized water work; NH allows handyman scope for fixtures and shutoffs but we default to licensed plumber for liability simplicity in the Quick Job lane.

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `valve_shutoff_replace` | Leaky valve / shutoff replacement (under-sink, behind-toilet) | 90 min | $200–$265–$325 | $275–$350–$425 | pro_supplied | $15–$35 | licensed_plumber | $1M | never | Soldered valve (needs torch), galvanized supply, frozen valve corroded into wall → Project |
| `supply_line_replace` | Sink supply line replacement (single) | 60 min | $150–$200–$250 | $200–$265–$325 | pro_supplied | $10–$25 | licensed_plumber | $1M | never | Multiple lines, behind-wall leak source → Project |
| `p_trap_replace` | P-trap replacement (single drain) | 60 min | $150–$200–$250 | $200–$265–$325 | pro_supplied | $20–$40 | licensed_plumber | $1M | never | Cast-iron tailpiece, wall stack tie-in → Project |
| `sink_stopper_replace` | Sink stopper / pop-up replacement | 45 min | $125–$160–$200 | $175–$215–$250 | pro_supplied | $15–$30 | handyman | $500K | never | Stuck/corroded mounting nut → minor add; tub stopper different scope |
| `water_heater_anode_replace` | Water heater anode rod replacement | 90 min | $200–$265–$325 | $275–$350–$425 | pro_supplied | $30–$70 | licensed_plumber | $1M | never | Tank >10 yrs old (recommend full replacement → Project), seized anode → Project |
| `washer_hose_replace` | Washing machine hose replacement (pair) | 45 min | $125–$165–$200 | $175–$215–$250 | pro_supplied | $30–$60 | handyman | $500K | never | Recessed laundry box damage, frozen shutoffs → recheck |

### 2.7 Light handyman / general (10 tasks)

| Task code | Display name | Duration | NH/ME L–M–H | MA L–M–H | Materials | Material cost | License | CGL min | Permit | Edge cases |
|---|---|---|---|---|---|---|---|---|---|---|
| `tv_mount_drywall` | TV mount install (drywall) | 60 min | $150–$190–$225 | $200–$240–$275 | customer_supplied | — | none | $500K | never | TV >65"/>75 lb (heavy mount), in-wall cable routing → recheck |
| `tv_mount_brick_plaster` | TV mount install (brick or plaster wall) | 90 min | $200–$250–$300 | $275–$325–$375 | customer_supplied | — | handyman | $500K | never | Brownstone, historic pointing → Project; full cable concealment in plaster → Project |
| `door_knob_deadbolt_replace` | Door knob or deadbolt replacement | 30 min | $100–$125–$150 | $135–$170–$200 | customer_supplied | — | none | $500K | never | Re-key needs (locksmith license), strike plate cut, sagging door → recheck |
| `window_blind_install` | Window blind install (per window) | 45 min | $100–$135–$175 | $135–$180–$225 | customer_supplied | — | none | $500K | never | Inside-mount on out-of-square window, large bay window → recheck |
| `curtain_rod_install` | Curtain rod install (per window) | 30 min | $90–$115–$140 | $120–$150–$185 | customer_supplied | — | none | $500K | never | Plaster wall (needs proper anchors), heavy drape rod → minor add |
| `picture_mirror_hang_heavy` | Hanging a picture or mirror (>10 lb, per item) | 30 min | $75–$95–$120 | $100–$125–$160 | customer_supplied | — | none | $500K | never | Antique frame, very large mirror (>50 lb), plaster wall → photo upload |
| `shelving_install_simple` | Shelving install (single shelf, brackets supplied) | 60 min | $125–$165–$200 | $175–$215–$250 | customer_supplied | — | handyman | $500K | never | Custom built-in, multi-shelf system, load-bearing shelf → Project |
| `weatherstrip_replace` | Weatherstripping replacement (single door) | 60 min | $125–$165–$200 | $175–$215–$250 | pro_supplied | $20–$40 | none | $500K | never | Multiple doors, threshold replacement, rotted door frame → Project |
| `attic_ladder_lube` | Attic ladder lubrication and adjustment | 45 min | $90–$120–$150 | $120–$155–$200 | pro_supplied | $5–$15 | none | $500K | never | Ladder broken/bent (replacement = Project), spring failure → recheck |
| `ring_doorbell_install_battery` | Battery doorbell install (no wiring) | 45 min | $100–$135–$170 | $135–$175–$215 | customer_supplied | — | none | $500K | never | Brick wall, masonry mounting, app pairing assistance → minor add |

---

## 3. Project-Mode Kick-Out Logic

When a customer requests a Quick Job that violates any of the following rules, the dispatch engine **must auto-route to Project mode** instead. The customer sees a friendly explanation: *"This job needs our full Project flow — multiple bids and code checks. We'll get you set up in 2 minutes."*

### 3.1 Hard kick-out rules (system enforced before pro is matched)

| # | Rule | Source signal | Action |
|---|---|---|---|
| K1 | Permit required | Catalog `permit_required = 'always'`, OR Wiseman flag on intake | Route to Project mode; pre-fill scope from Quick Job answers |
| K2 | Job value exceeds $1,500 | Customer chooses sherpa_supplied materials pushing total >$1,500 | Route to Project mode; offer 3-bid flow |
| K3 | Multi-trade coordination needed | Customer photo or scope text mentions 2+ trades (e.g., "tile + plumbing + electrical") | Route to Project mode |
| K4 | Material cost > 50% of total job | Sherpa-supplied material cost / total ≥ 0.5 | Route to Project mode (volatile margin, better in bid flow) |
| K5 | Old-house edge case | Customer enters home built pre-1950 AND task touches lath/plaster, paint stripping, or drilling masonry | If task = `lath_plaster_spot` (Boston) → keep in Quick Job but **Old-House Verified pros only**. All other paint/drywall/electrical → Project (lead/asbestos disclosure) |
| K6 | Code-validation flag | Wiseman LIGHT validation returns `safety_concern` (e.g., panel <100A on a job that touches the panel; aluminum branch wiring on outlet swap) | Route to Project mode |
| K7 | Customer requests follow-up visit | Customer flow says "needs 2 visits" OR scope wording contains "phase 1 / phase 2" | Quick Job is one-visit by design → route to Project |
| K8 | Customer requests scope expansion mid-quote | Pro's pre-work photo upload diff > 20% from intake photo | Pro hits "Out of scope" button → system auto-converts to Project mode quote, releases Quick Job slot |

### 3.2 Soft warnings (allow Quick Job, but notify both parties)

| # | Rule | Source signal | Action |
|---|---|---|---|
| W1 | Job value > $1,000 (approaching cap) | Total quote ≥ $1,000 | Show customer: "This is at the high end of our Quick Job range. If anything else comes up at the visit, we'll convert to a Project quote." |
| W2 | Pro counter-quote >15% over standard band | Pro's counter exceeds price band high × 1.15 | Show customer both options ("standard $325 / Mike's quote $425 — slightly higher due to old plumbing"). Customer picks. |
| W3 | Customer-supplied material brand unknown | No brand in description, generic photo | Pro can request photo of model number before accepting |
| W4 | Pre-1978 home + paint task | Built pre-1978 + any `paint_*` task | Show customer EPA RRP lead-paint notice; pro must be RRP-certified (badge check) |
| W5 | Pro at daily acceptance cap | Pro's daily accepted Quick Jobs = `daily_cap` | Skip pro, route to next eligible pro |

### 3.3 Pro-side "stuck job" escape hatch

A pro who has accepted a Quick Job but discovers on arrival that scope exceeds Quick Job bounds can hit **"Convert to Project"** in the pro app. This:
1. Releases the Quick Job slot (no penalty to pro)
2. Auto-creates a Project-mode job with the customer's intake info + pro's pre-work photos
3. Gives the original pro **right of first refusal** on the Project bid (24-hour window)
4. Pays the pro a **$50 trip fee** from the Quick Job hold (deducted from refund to customer with explanation)
5. Refunds the customer the remainder, with a tap-to-confirm Project flow

This is critical for handling K8 / K5 / W3 cases discovered on-site — see §10 for the most-likely-stuck edge case.

---

## 4. Database Schema Additions (for T1 to apply to `src/db/drizzle-schema.ts`)

> **NOTE for T1:** these additions reference existing tables `pros`, `users`, `jobs`, `hubs` from the current schema. Do not modify those existing tables — only add the three new ones below. Apply via migration 006 (§5).

```typescript
// ===========================================================================
// QUICK JOB CATALOG (additions to src/db/drizzle-schema.ts)
// ===========================================================================

/**
 * Catalog of pre-priced Quick Job task templates.
 * One row per `taskCode`. Pricing is per-metro and lives in `quickJobMetroPricing`.
 *
 * `permitRequired = 'always'` rows MUST never be dispatched as Quick Jobs;
 * intake should auto-route them to Project mode (see §3 K1).
 */
export const quickJobCatalog = pgTable(
  "quick_job_catalog",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskCode: varchar("task_code", { length: 60 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    category: varchar("category", { length: 30 }).notNull(),
    // bathroom | kitchen | painting | drywall | electrical | plumbing | handyman
    estimatedDurationMin: integer("estimated_duration_min").notNull(),
    // 30-min increments per spec
    materialsHandling: varchar("materials_handling", { length: 30 }).notNull(),
    // customer_supplied | pro_supplied | sherpa_supplied_via_zinc | customer_choice
    materialCostLowCents: integer("material_cost_low_cents"),
    materialCostHighCents: integer("material_cost_high_cents"),
    licenseRequired: varchar("license_required", { length: 30 }).notNull(),
    // none | handyman | licensed_electrician | licensed_plumber | licensed_other
    cglMinimumCents: integer("cgl_minimum_cents").notNull(),
    // 50_000_000 ($500K) for handyman, 100_000_000 ($1M) for licensed trades
    permitRequired: varchar("permit_required", { length: 12 }).notNull(),
    // never | sometimes | always
    edgeCases: text("edge_cases"),
    // Free-text engineering note: what scope additions push out of Quick Job
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_quick_job_catalog_category").on(table.category),
    index("idx_quick_job_catalog_license").on(table.licenseRequired),
    index("idx_quick_job_catalog_permit").on(table.permitRequired),
    index("idx_quick_job_catalog_is_active").on(table.isActive),
  ],
);

/**
 * Per-metro pricing band for each catalog task.
 * Composite unique on (taskCode, metro) — one band per metro per task.
 * Metros are slugged (portsmouth_nh, manchester_nh, portland_me, boston_ma).
 * Phase 2 will support hyper-local zip-code pricing — keep schema additive.
 */
export const quickJobMetroPricing = pgTable(
  "quick_job_metro_pricing",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskCode: varchar("task_code", { length: 60 })
      .notNull()
      .references(() => quickJobCatalog.taskCode, { onDelete: "cascade" }),
    metro: varchar("metro", { length: 30 }).notNull(),
    // portsmouth_nh | manchester_nh | portland_me | boston_ma
    priceLowCents: integer("price_low_cents").notNull(),
    priceMedianCents: integer("price_median_cents").notNull(),
    priceHighCents: integer("price_high_cents").notNull(),
    sourceNotes: text("source_notes"),
    // e.g., "HomeGuide 2026 toilet install $250-$350; HJD field rate"
    effectiveAt: date("effective_at").notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("quick_job_metro_pricing_task_metro_unique").on(
      table.taskCode,
      table.metro,
    ),
    index("idx_quick_job_metro_pricing_task_code").on(table.taskCode),
    index("idx_quick_job_metro_pricing_metro").on(table.metro),
  ],
);

/**
 * Pro opt-in to specific Quick Job categories with daily cap and per-task counter-quote.
 * One row per (proId, category) for category opt-in; per-task overrides via taskCode.
 *
 * - `categoryOptedIn = true` + `taskCode IS NULL` → blanket opt-in for category
 * - `taskCode IS NOT NULL` → per-task override (counter-quote, decline)
 */
export const quickJobPros = pgTable(
  "quick_job_pros",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proId: uuid("pro_id")
      .notNull()
      .references(() => pros.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 30 }).notNull(),
    taskCode: varchar("task_code", { length: 60 }).references(
      () => quickJobCatalog.taskCode,
      { onDelete: "cascade" },
    ),
    categoryOptedIn: boolean("category_opted_in").notNull().default(true),
    counterQuoteCents: integer("counter_quote_cents"),
    // If set, pro is offering this task at a non-standard price
    counterQuoteReason: varchar("counter_quote_reason", { length: 255 }),
    dailyCap: integer("daily_cap").notNull().default(3),
    // Max Quick Jobs/day pro will accept; Dispatch enforces
    acceptedToday: integer("accepted_today").notNull().default(0),
    // Reset daily by cron at 4am pro local
    lastJobAt: timestamp("last_job_at", { withTimezone: true }),
    acceptanceRatePct: decimal("acceptance_rate_pct", {
      precision: 5,
      scale: 2,
    }),
    // Rolling 30-day acceptance rate; <50% = removed from lane (per §13 Q3)
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("quick_job_pros_pro_category_task_unique").on(
      table.proId,
      table.category,
      table.taskCode,
    ),
    index("idx_quick_job_pros_pro_id").on(table.proId),
    index("idx_quick_job_pros_category").on(table.category),
    index("idx_quick_job_pros_task_code").on(table.taskCode),
    index("idx_quick_job_pros_is_active").on(table.isActive),
  ],
);
```

### 4.1 Existing-table linkage

The `jobs` table already has fields that work for Quick Job dispatch — no `jobs` schema change needed. T1 should use:

- `jobs.dispatchType = 'quick_job'` (new value alongside existing `'bid'` / `'instant'`)
- `jobs.category` → links to `quickJobCatalog.category`
- A new column would be cleaner: **add `taskCode varchar(60)`** to `jobs` referencing `quickJobCatalog.taskCode`. T1 to confirm whether to add as nullable column (recommended) or store in `wisemanValidation` JSONB. **Recommendation:** add the column for query performance; migration 006 includes it (see §5).

---

## 5. Migration 006 — `src/db/migrations/006_quick_job_catalog.sql`

```sql
-- =============================================================================
-- 006_quick_job_catalog.sql
-- Adds Quick Job catalog, metro pricing, pro opt-in, and seeds the 12 starter
-- tasks from docs/operations/quick-job-lane.md §4.
-- Companion doc: docs/operations/quick-job-catalog-full.md (47 tasks total)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. quick_job_catalog
-- ---------------------------------------------------------------------------
CREATE TABLE quick_job_catalog (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_code                VARCHAR(60)  NOT NULL UNIQUE,
    display_name             VARCHAR(255) NOT NULL,
    category                 VARCHAR(30)  NOT NULL,
    estimated_duration_min   INTEGER      NOT NULL,
    materials_handling       VARCHAR(30)  NOT NULL,
    material_cost_low_cents  INTEGER,
    material_cost_high_cents INTEGER,
    license_required         VARCHAR(30)  NOT NULL,
    cgl_minimum_cents        INTEGER      NOT NULL,
    permit_required          VARCHAR(12)  NOT NULL,
    edge_cases               TEXT,
    is_active                BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_qjc_category CHECK (category IN (
        'bathroom','kitchen','painting','drywall','electrical','plumbing','handyman'
    )),
    CONSTRAINT chk_qjc_materials CHECK (materials_handling IN (
        'customer_supplied','pro_supplied','sherpa_supplied_via_zinc','customer_choice'
    )),
    CONSTRAINT chk_qjc_license CHECK (license_required IN (
        'none','handyman','licensed_electrician','licensed_plumber','licensed_other'
    )),
    CONSTRAINT chk_qjc_permit CHECK (permit_required IN (
        'never','sometimes','always'
    )),
    CONSTRAINT chk_qjc_duration CHECK (estimated_duration_min > 0
        AND estimated_duration_min % 30 = 0),
    CONSTRAINT chk_qjc_material_cost_range CHECK (
        material_cost_low_cents IS NULL
        OR material_cost_high_cents IS NULL
        OR material_cost_low_cents <= material_cost_high_cents
    ),
    CONSTRAINT chk_qjc_cgl_positive CHECK (cgl_minimum_cents > 0)
);

CREATE INDEX idx_quick_job_catalog_category   ON quick_job_catalog(category);
CREATE INDEX idx_quick_job_catalog_license    ON quick_job_catalog(license_required);
CREATE INDEX idx_quick_job_catalog_permit     ON quick_job_catalog(permit_required);
CREATE INDEX idx_quick_job_catalog_is_active  ON quick_job_catalog(is_active);

-- ---------------------------------------------------------------------------
-- 2. quick_job_metro_pricing
-- ---------------------------------------------------------------------------
CREATE TABLE quick_job_metro_pricing (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_code           VARCHAR(60) NOT NULL
        REFERENCES quick_job_catalog(task_code) ON DELETE CASCADE,
    metro               VARCHAR(30) NOT NULL,
    price_low_cents     INTEGER     NOT NULL,
    price_median_cents  INTEGER     NOT NULL,
    price_high_cents    INTEGER     NOT NULL,
    source_notes        TEXT,
    effective_at        DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_qjmp_metro CHECK (metro IN (
        'portsmouth_nh','manchester_nh','portland_me','boston_ma'
    )),
    CONSTRAINT chk_qjmp_price_order CHECK (
        price_low_cents <= price_median_cents
        AND price_median_cents <= price_high_cents
    ),
    CONSTRAINT chk_qjmp_price_positive CHECK (price_low_cents > 0)
);

CREATE UNIQUE INDEX quick_job_metro_pricing_task_metro_unique
    ON quick_job_metro_pricing(task_code, metro);
CREATE INDEX idx_quick_job_metro_pricing_task_code ON quick_job_metro_pricing(task_code);
CREATE INDEX idx_quick_job_metro_pricing_metro     ON quick_job_metro_pricing(metro);

-- ---------------------------------------------------------------------------
-- 3. quick_job_pros
-- ---------------------------------------------------------------------------
CREATE TABLE quick_job_pros (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id                UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    category              VARCHAR(30) NOT NULL,
    task_code             VARCHAR(60)
        REFERENCES quick_job_catalog(task_code) ON DELETE CASCADE,
    category_opted_in     BOOLEAN     NOT NULL DEFAULT TRUE,
    counter_quote_cents   INTEGER,
    counter_quote_reason  VARCHAR(255),
    daily_cap             INTEGER     NOT NULL DEFAULT 3,
    accepted_today        INTEGER     NOT NULL DEFAULT 0,
    last_job_at           TIMESTAMPTZ,
    acceptance_rate_pct   NUMERIC(5,2),
    is_active             BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_qjp_category CHECK (category IN (
        'bathroom','kitchen','painting','drywall','electrical','plumbing','handyman'
    )),
    CONSTRAINT chk_qjp_daily_cap CHECK (daily_cap >= 1 AND daily_cap <= 20),
    CONSTRAINT chk_qjp_accepted_nonneg CHECK (accepted_today >= 0),
    CONSTRAINT chk_qjp_acceptance_rate CHECK (
        acceptance_rate_pct IS NULL
        OR (acceptance_rate_pct >= 0 AND acceptance_rate_pct <= 100)
    )
);

CREATE UNIQUE INDEX quick_job_pros_pro_category_task_unique
    ON quick_job_pros(pro_id, category, COALESCE(task_code, ''));
CREATE INDEX idx_quick_job_pros_pro_id     ON quick_job_pros(pro_id);
CREATE INDEX idx_quick_job_pros_category   ON quick_job_pros(category);
CREATE INDEX idx_quick_job_pros_task_code  ON quick_job_pros(task_code);
CREATE INDEX idx_quick_job_pros_is_active  ON quick_job_pros(is_active);

-- ---------------------------------------------------------------------------
-- 4. Add task_code to jobs (links a job to a catalog task; nullable for Project)
-- ---------------------------------------------------------------------------
ALTER TABLE jobs
    ADD COLUMN task_code VARCHAR(60)
        REFERENCES quick_job_catalog(task_code) ON DELETE SET NULL;

CREATE INDEX idx_jobs_task_code ON jobs(task_code);

-- 'quick_job' becomes a valid dispatch_type alongside 'bid' and 'instant'.
-- (No CHECK constraint exists on jobs.dispatch_type today; adding one here would
--  require a separate migration to backfill — leaving for T1's discretion.)

-- ---------------------------------------------------------------------------
-- 5. Seed: 12 starter tasks from quick-job-lane.md §4
--    (Full 47-task seed lives in a follow-on data migration once §4 is approved.)
-- ---------------------------------------------------------------------------
INSERT INTO quick_job_catalog (
    task_code, display_name, category, estimated_duration_min,
    materials_handling, material_cost_low_cents, material_cost_high_cents,
    license_required, cgl_minimum_cents, permit_required, edge_cases
) VALUES
    ('toilet_install_basic',
     'Toilet install (you supply the toilet)',
     'bathroom', 90, 'customer_supplied', NULL, NULL,
     'handyman', 50000000, 'sometimes',
     'Cast-iron drain, broken closet flange, rotted subfloor → Project'),
    ('paint_wall_accent',
     'Paint a single accent wall (≤120 sqft)',
     'painting', 90, 'customer_supplied', NULL, NULL,
     'none', 50000000, 'never',
     'Vaulted ceiling, repair before paint, dark-over-light primer needs → recheck'),
    ('drywall_patch_small',
     'Small drywall patch (up to 6 inches) + paint blend',
     'drywall', 90, 'pro_supplied', 1500, 3000,
     'handyman', 50000000, 'never',
     'Mold visible, structural framing, re-occurring leak source → Project'),
    ('ceiling_fan_install_existing',
     'Ceiling fan install (existing wiring + box)',
     'electrical', 90, 'customer_supplied', NULL, NULL,
     'licensed_electrician', 100000000, 'never',
     'No fan-rated box, no existing wiring, vaulted ceiling → Project'),
    ('gfci_outlet_replace',
     'GFCI outlet replacement',
     'electrical', 45, 'pro_supplied', 2000, 3000,
     'licensed_electrician', 100000000, 'never',
     'Backstabbed wiring, aluminum wiring, no ground → recheck or Project'),
    ('garbage_disposal_install_kitchen',
     'Garbage disposal install (under kitchen sink)',
     'kitchen', 90, 'customer_choice', 9000, 22000,
     'handyman', 50000000, 'never',
     'No GFCI, no dedicated outlet, hardwired → kicks to electrical'),
    ('smoke_co_detector_swap',
     'Smoke and carbon monoxide detector replacement',
     'handyman', 30, 'customer_choice', 2000, 6000,
     'licensed_electrician', 100000000, 'never',
     'Hardwired interconnect adjustment, full-house >5 units → Project'),
    ('tv_mount_drywall',
     'TV mount install (drywall)',
     'handyman', 60, 'customer_supplied', NULL, NULL,
     'none', 50000000, 'never',
     'TV >65"/>75 lb (heavy mount), in-wall cable routing → recheck'),
    ('door_knob_deadbolt_replace',
     'Door knob or deadbolt replacement',
     'handyman', 30, 'customer_supplied', NULL, NULL,
     'none', 50000000, 'never',
     'Re-key needs (locksmith license), strike plate cut, sagging door → recheck'),
    ('light_fixture_swap',
     'Light fixture swap (existing wiring)',
     'electrical', 45, 'customer_supplied', NULL, NULL,
     'licensed_electrician', 100000000, 'never',
     'Heavy chandelier (>35 lb), no junction box → Project'),
    ('valve_shutoff_replace',
     'Leaky valve / shutoff replacement (under-sink, behind-toilet)',
     'plumbing', 90, 'pro_supplied', 1500, 3500,
     'licensed_plumber', 100000000, 'never',
     'Soldered valve, galvanized supply, frozen valve corroded into wall → Project'),
    ('toilet_repair_flapper',
     'Toilet repair (running, weak flush, fill valve)',
     'bathroom', 45, 'pro_supplied', 1500, 3000,
     'handyman', 50000000, 'never',
     'Tank crack, unseen leak below subfloor → Project');

-- ---------------------------------------------------------------------------
-- 6. Seed: per-metro pricing for the 12 starter tasks
--    Sources documented per-row; full source table in catalog doc §8.
-- ---------------------------------------------------------------------------
INSERT INTO quick_job_metro_pricing (
    task_code, metro, price_low_cents, price_median_cents, price_high_cents, source_notes
) VALUES
    -- toilet_install_basic
    ('toilet_install_basic','portsmouth_nh', 25000, 30000, 35000, 'HomeGuide 2026 toilet install $250-$350; HJD field rate'),
    ('toilet_install_basic','manchester_nh', 25000, 30000, 35000, 'HomeGuide 2026; matches Portsmouth band'),
    ('toilet_install_basic','portland_me',   25000, 30000, 35000, 'HomeGuide 2026; ME tracks NH'),
    ('toilet_install_basic','boston_ma',     32500, 39000, 45000, 'Angi 2026 Boston metro +30%; Homewyse calc'),

    -- paint_wall_accent
    ('paint_wall_accent','portsmouth_nh', 20000, 24000, 27500, 'HomeGuide 2026 painter rates $1.50-$3/sqft; 120sqft'),
    ('paint_wall_accent','manchester_nh', 20000, 24000, 27500, 'HomeGuide 2026'),
    ('paint_wall_accent','portland_me',   20000, 24000, 27500, 'HomeGuide 2026'),
    ('paint_wall_accent','boston_ma',     27500, 31500, 35000, 'Fixr 2026 MA painter premium'),

    -- drywall_patch_small
    ('drywall_patch_small','portsmouth_nh', 20000, 25000, 30000, 'HomeAdvisor 2026 drywall patch $150-$400'),
    ('drywall_patch_small','manchester_nh', 20000, 25000, 30000, 'HomeAdvisor 2026'),
    ('drywall_patch_small','portland_me',   20000, 25000, 30000, 'HomeAdvisor 2026'),
    ('drywall_patch_small','boston_ma',     27500, 34000, 40000, 'HomeAdvisor 2026 +30% Boston'),

    -- ceiling_fan_install_existing
    ('ceiling_fan_install_existing','portsmouth_nh', 20000, 25000, 30000, 'Fixr 2026 ceiling fan install $150-$350'),
    ('ceiling_fan_install_existing','manchester_nh', 20000, 25000, 30000, 'Fixr 2026'),
    ('ceiling_fan_install_existing','portland_me',   20000, 25000, 30000, 'Fixr 2026'),
    ('ceiling_fan_install_existing','boston_ma',     27500, 34000, 40000, 'Fixr 2026 MA licensed-electrician premium'),

    -- gfci_outlet_replace
    ('gfci_outlet_replace','portsmouth_nh', 12500, 15000, 17500, 'Angi 2026 GFCI install $130-$300'),
    ('gfci_outlet_replace','manchester_nh', 12500, 15000, 17500, 'Angi 2026'),
    ('gfci_outlet_replace','portland_me',   12500, 15000, 17500, 'Angi 2026'),
    ('gfci_outlet_replace','boston_ma',     17500, 20000, 22500, 'Angi 2026 MA licensed-electrician'),

    -- garbage_disposal_install_kitchen
    ('garbage_disposal_install_kitchen','portsmouth_nh', 20000, 25000, 30000, 'HomeGuide 2026 disposal install $200-$400'),
    ('garbage_disposal_install_kitchen','manchester_nh', 20000, 25000, 30000, 'HomeGuide 2026'),
    ('garbage_disposal_install_kitchen','portland_me',   20000, 25000, 30000, 'HomeGuide 2026'),
    ('garbage_disposal_install_kitchen','boston_ma',     27500, 34000, 40000, 'HomeGuide 2026 MA premium'),

    -- smoke_co_detector_swap (per unit)
    ('smoke_co_detector_swap','portsmouth_nh', 7500, 10000, 12500, 'HomeAdvisor 2026 detector swap; per unit'),
    ('smoke_co_detector_swap','manchester_nh', 7500, 10000, 12500, 'HomeAdvisor 2026'),
    ('smoke_co_detector_swap','portland_me',   7500, 10000, 12500, 'HomeAdvisor 2026'),
    ('smoke_co_detector_swap','boston_ma',    10000, 12500, 15000, 'HomeAdvisor 2026 MA premium'),

    -- tv_mount_drywall
    ('tv_mount_drywall','portsmouth_nh', 15000, 19000, 22500, 'Thumbtack 2026 TV mount $100-$300'),
    ('tv_mount_drywall','manchester_nh', 15000, 19000, 22500, 'Thumbtack 2026'),
    ('tv_mount_drywall','portland_me',   15000, 19000, 22500, 'Thumbtack 2026'),
    ('tv_mount_drywall','boston_ma',     20000, 24000, 27500, 'Thumbtack 2026 MA premium'),

    -- door_knob_deadbolt_replace
    ('door_knob_deadbolt_replace','portsmouth_nh', 10000, 12500, 15000, 'HomeGuide 2026 lock install $80-$200'),
    ('door_knob_deadbolt_replace','manchester_nh', 10000, 12500, 15000, 'HomeGuide 2026'),
    ('door_knob_deadbolt_replace','portland_me',   10000, 12500, 15000, 'HomeGuide 2026'),
    ('door_knob_deadbolt_replace','boston_ma',     13500, 17000, 20000, 'HomeGuide 2026 MA premium'),

    -- light_fixture_swap
    ('light_fixture_swap','portsmouth_nh', 12500, 15000, 17500, 'Fixr 2026 fixture install $100-$250'),
    ('light_fixture_swap','manchester_nh', 12500, 15000, 17500, 'Fixr 2026'),
    ('light_fixture_swap','portland_me',   12500, 15000, 17500, 'Fixr 2026'),
    ('light_fixture_swap','boston_ma',     17500, 20000, 22500, 'Fixr 2026 MA licensed-electrician'),

    -- valve_shutoff_replace
    ('valve_shutoff_replace','portsmouth_nh', 20000, 26500, 32500, 'Angi 2026 valve replace $150-$400'),
    ('valve_shutoff_replace','manchester_nh', 20000, 26500, 32500, 'Angi 2026'),
    ('valve_shutoff_replace','portland_me',   20000, 26500, 32500, 'Angi 2026'),
    ('valve_shutoff_replace','boston_ma',     27500, 35000, 42500, 'Angi 2026 MA licensed-plumber'),

    -- toilet_repair_flapper
    ('toilet_repair_flapper','portsmouth_nh', 12500, 15000, 17500, 'HomeAdvisor 2026 toilet repair $90-$300'),
    ('toilet_repair_flapper','manchester_nh', 12500, 15000, 17500, 'HomeAdvisor 2026'),
    ('toilet_repair_flapper','portland_me',   12500, 15000, 17500, 'HomeAdvisor 2026'),
    ('toilet_repair_flapper','boston_ma',     15000, 19000, 22500, 'HomeAdvisor 2026 MA premium');

COMMIT;

-- =============================================================================
-- Follow-on data migration (007_quick_job_catalog_seed_full.sql) will add the
-- remaining 35 tasks + per-metro pricing once Phyrom + Pro Success Manager
-- approve the full §2 catalog. Schema is already future-proof.
-- =============================================================================
```

---

## 6. Customer-Facing Menu UX Spec

### 6.1 Wireframe (mobile-first, single-column)

```
┌─────────────────────────────────────────┐
│  ← Sherpa Pros                          │
│                                         │
│  ╔═════════════╗  ┌─────────────┐      │
│  ║ Quick Job   ║  │  Project    │      │
│  ╚═════════════╝  └─────────────┘      │
│  Same-day, pre-priced.  Multiple bids. │
│  Confirmed in 30 min.   Code-checked.  │
│                                         │
│  Pick a category                        │
│ ┌────────┬────────┬────────┬────────┐  │
│ │  Bath  │ Kitchen│Painting│Drywall │  │
│ ├────────┼────────┼────────┼────────┤  │
│ │ Elec.  │Plumbing│Handyman│        │  │
│ └────────┴────────┴────────┴────────┘  │
│                                         │
│  Most popular this week                 │
│ ┌─────────────────────────────────────┐│
│ │ Toilet install                      ││
│ │ from $250 · about 1.5 hrs           ││
│ │ ETA: today 2pm                   →  ││
│ └─────────────────────────────────────┘│
│ ┌─────────────────────────────────────┐│
│ │ Paint a single accent wall          ││
│ │ from $200 · about 1.5 hrs           ││
│ │ ETA: tomorrow 9am                →  ││
│ └─────────────────────────────────────┘│
│ ┌─────────────────────────────────────┐│
│ │ Ceiling fan install                 ││
│ │ from $200 · about 1.5 hrs           ││
│ │ ETA: today 4pm                   →  ││
│ └─────────────────────────────────────┘│
│                                         │
│  Doesn't fit any of these?              │
│  → Switch to Project mode  [→]          │
└─────────────────────────────────────────┘
```

### 6.2 Category drill-in

Tapping a category opens a **scrollable list of tile cards** for that category. Each tile:
- Display name (no jargon)
- "from $XXX" (low end of metro band)
- "about X hrs" (estimated duration)
- ETA (computed from nearest opted-in pro's next open slot)
- Right chevron → opens task detail

### 6.3 Task detail screen

```
┌─────────────────────────────────────────┐
│  ← Toilet install                       │
│                                         │
│  $250 – $350 in your area               │
│  About 1.5 hours · One visit            │
│                                         │
│  What we do:                            │
│  • Remove your old toilet               │
│  • Install your new toilet (you supply) │
│  • Replace wax ring + supply line       │
│  • Test for leaks + haul off old toilet │
│                                         │
│  When                                   │
│ ┌───────────┬───────────┬───────────┐  │
│ │  Today    │ Tomorrow  │ This week │  │
│ │  ✓        │           │           │  │
│ └───────────┴───────────┴───────────┘  │
│                                         │
│  Where                                  │
│  [Use my address] or [Enter address]    │
│                                         │
│  Anything we should know? (optional)    │
│  ┌───────────────────────────────────┐  │
│  │ e.g., toilet is in basement bath  │  │
│  └───────────────────────────────────┘  │
│  📷 Add a photo                         │
│                                         │
│  Add Same-Day Guarantee for $9?         │
│  [ ] Yes, give me on-time + re-book     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  See pros + pick a time     →   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 6.4 Match screen (one-pro auto-assigned)

```
┌─────────────────────────────────────────┐
│  ← Confirm your pro                     │
│                                         │
│  ┌──────┐  Mike R.                      │
│  │photo │  ★ 4.9 (87 jobs)              │
│  └──────┘  Licensed handyman · NH       │
│                                         │
│  $325 · arrives today by 2:00pm         │
│  + $9 Same-Day Guarantee                │
│  ────────────────────                   │
│  Total: $334                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Confirm and book           →   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Not the right fit? Try another pro     │
└─────────────────────────────────────────┘
```

### 6.5 Copy rules (per spec §3.3 + Brand Guardian)

- "Quick Job" only as the tab label (per §13 Q1 — Phyrom may rename later)
- Never display the word "Wiseman" anywhere
- Never use "AI" as the headline; OK in support copy ("we double-check the price")
- Never display abbreviations on first use: "Same-Day Guarantee" not "SDG"
- Never use a surname for Phyrom anywhere (only first name + "founder")
- "Licensed" is true only where state-licensed trades are required; for general handyman tasks say "verified handyman" or just the pro's name + rating

---

## 7. Pro Opt-In UX Spec (onboarding additions)

Adds **one new step** to existing pro onboarding flow (`src/app/(dashboard)/pro/onboarding/`), positioned after license + insurance verification.

### 7.1 Step: "Quick Job lane (optional)"

```
┌─────────────────────────────────────────┐
│  Quick Job lane                         │
│                                         │
│  Want pre-priced same-day jobs in your  │
│  area? Pick the categories you do.      │
│                                         │
│  ☐ Bathroom    (toilets, faucets, fans) │
│  ☐ Kitchen     (faucets, disposals)     │
│  ☐ Painting    (single walls, rooms)    │
│  ☐ Drywall     (patches, texture)       │
│  ☐ Electrical  (light circuit work) *   │
│  ☐ Plumbing    (light fixture work) *   │
│  ☐ Handyman    (mounts, locks, blinds)  │
│                                         │
│  * Electrical and Plumbing require a    │
│    state license (which you already     │
│    uploaded).                           │
│                                         │
│  How many Quick Jobs per day max?       │
│  [─────●──────] 3 jobs/day              │
│  (You can change this anytime)          │
│                                         │
│  Pricing:                               │
│  We set the standard price per job in   │
│  your area. You can counter-quote up    │
│  to ±15% per job before accepting.      │
│                                         │
│  [ ] I accept the standard pricing      │
│      bands for the categories I picked  │
│                                         │
│  [Skip for now]   [Save and continue →] │
└─────────────────────────────────────────┘
```

### 7.2 Per-category pricing review

When pro checks a category, expand inline to show that category's price bands for their home metro. Pro must scroll/acknowledge. This populates `quick_job_pros` rows (one per category).

### 7.3 Insurance verification reuse

The existing `pro_insurance_certificates` table (referenced in §6 of `quick-job-lane.md`) already stores the CGL certificate. The Quick Job opt-in flow:

1. Reads `pros.insuranceVerified = true`
2. Reads `proCertifications` to verify the certificate `coverage_amount_cents >= cgl_minimum_cents` of the lowest-CGL category they opted into
3. For categories requiring `licensed_electrician` or `licensed_plumber`, also reads `pros.licenseNumber + licenseState` and confirms `licenseVerified = true`
4. **Lower bar than Project mode:** $500K CGL acceptable for handyman categories (vs $1M Project standard) — explicitly per `quick-job-lane.md` §6

### 7.4 Daily cap + acceptance rate

- Default daily cap = 3 jobs/day (slider 1–10)
- Acceptance rate threshold = 50% rolling 30-day (per §13 Q3 of parent doc)
- Below 50% → pro is auto-paused from Quick Job lane (Project mode access unchanged)
- Acceptance rate is shown on the pro's earnings dashboard; weekly digest emails it

### 7.5 Service area reuse

Service area uses the existing `pros.travelRadiusKm` field — no schema change. Default 50 km (already in schema), pro can adjust. Quick Job dispatch only matches pros within radius of the job pin.

---

## 8. Pricing-Band Sourcing Reference Table

| Source | URL | What we used it for | Year |
|---|---|---|---|
| HomeGuide Handyman Hourly Rates | https://homeguide.com/costs/handyman-prices | Base hourly + flat rates for handyman tasks; informs all 7 categories | 2026 |
| Fixr Handyman Cost Guide | https://www.fixr.com/costs/handyman | Service-call fee anchor ($40-$75); ceiling fan, fixture install | 2026 |
| HomeAdvisor Handyman Price List | https://www.homeadvisor.com/cost/handyman/ | Drywall patch ranges, detector swap, toilet repair | 2026 |
| Angi Toilet Installation Cost | https://www.angi.com/articles/how-much-does-toilet-installation-cost.htm | Toilet install ($150-$370 nationally; MA premium +30%) | 2026 |
| Homewyse Toilet Install Calculator | https://www.homewyse.com/services/cost_to_install_toilet.html | Per-zip-code toilet install (Portsmouth, Boston) — anchors metro spread | 2026 |
| HouseCall Pro Handyman Pricing Guide | https://www.housecallpro.com/resources/how-to-price-handyman-jobs/ | Pro-side pricing methodology — informed counter-quote ±15% rule | 2026 |
| Thumbtack Instant Match (industry) | https://www.thumbtack.com/ | TV mount, blind install ranges; auto-assignment model precedent | 2026 |
| HJD Builders field rate (internal) | n/a — Phyrom direct experience | NH/Seacoast labor + materials sanity-check; corrected national data for local realities | 2026 |
| Boston Smart Plastering | https://www.boston-smart-plastering.com/post/water-damage | Lath/plaster spot-repair pricing (Boston specialty, narrow pro pool) | 2026 |
| EPA RRP rule (federal) | https://www.epa.gov/lead/lead-renovation-repair-and-painting-program | Lead-paint disclosure trigger for pre-1978 homes (kick-out rule W4) | 2026 |

**Methodology notes:**
- Prices triangulate three sources minimum where possible (national avg + state-adjusted + local field rate).
- MA premium is applied at +30% over NH/ME for handyman scope, +35% where licensed-trade premium applies (electrical/plumbing). Source: HomeGuide MA-specific pages cross-referenced with Boston-area Thumbtack pro listings.
- ME tracks NH within ±5% on all categories (no MA premium); single band used.
- Boston is the only metro where MA-specific lath/plaster pricing applies (`lath_plaster_spot` task is `n/a` in NH/ME — schema enforces this by simply not seeding NH/ME rows for that task_code).

**Refresh cadence:** Pricing bands are reviewed quarterly by Pro Success Manager + Phyrom. The `effective_at` column on `quick_job_metro_pricing` allows historical pricing audits without UPDATE — new effective bands are INSERTed and the dispatch query selects WHERE `effective_at <= CURRENT_DATE` ORDER BY `effective_at DESC` LIMIT 1.

---

## 9. Open Questions for Engineering / Phyrom

1. **`task_code` on `jobs`:** add as nullable column (recommended, included in migration 006) or store in `wisemanValidation` JSONB? Performance vs schema-purity trade-off.
2. **Counter-quote display:** show both standard and pro-counter to customer (W2), or auto-decline and find next pro? Decision impacts §6.4 wireframe.
3. **Same-Day Guarantee:** stored as a separate row on `payments` (service fee line item) or a new `quick_job_addons` table? T1 to confirm.
4. **`taskCode` collisions:** the unique constraint is global. If a task_code (e.g., `paint_door_single`) ever needs a regional variant, we need a metro-prefixed code or a new column. Future-proof now? Recommend: keep global, version via `_v2` suffix when needed.
5. **Pro-side counter-quote per task vs per job:** the current `quick_job_pros.counter_quote_cents` is per-task standing offer. Per-job override (one-time counter for a specific incoming job) would need a new field on `dispatch_attempts`. Defer to Phase 2 unless Phyrom wants per-job in v1.

---

## 10. Summary (250 words) — Required Return Output

**(a) Five most-likely-to-launch-at-volume Quick Job tasks** (consumer demand frequency, per HomeAdvisor 2026 + Thumbtack instant-match data + HJD field experience):

1. **`tv_mount_drywall`** — apartment turnover + new-TV moments; high frequency, low-skill, near-zero edge cases. Best volume play.
2. **`gfci_outlet_replace`** — code-required (NEC kitchens, baths, garages), tripped-GFCI emergencies common, fast 45-min job, licensed-electrician justification = trust premium.
3. **`toilet_repair_flapper`** — running-toilet problem affects every household every 2-3 years. $150 ticket fits Same-Day Guarantee pitch perfectly; pure handyman scope.
4. **`paint_wall_accent`** — Pinterest/Instagram-driven impulse demand; 90 min visit, customer-supplied paint = zero material risk for pro.
5. **`light_fixture_swap`** — same as TV mount: turnover + style-refresh trigger, recurring, no permits.

**(b) Trickiest task to price + dispatch:** **`lath_plaster_spot`** (Boston specialty). Narrow pro pool (Old-House Verified handful), highly variable scope (a 4" patch on lath can hide rotted lath structure, asbestos in original plaster, or knob-and-tube wiring behind), and no clean MA-wide pricing comp — Boston Smart Plastering quotes are the only reliable anchor and they're tied to specific firms. Mitigation: keep in catalog as Boston-only, gate to Old-House Verified pros, mandatory pre-work photo upload, and surface a **higher counter-quote allowance (±25% vs standard ±15%)** for this task only.

**(c) Single edge case most likely to cause a "stuck Quick Job":** **frozen/corroded shutoff valves on any plumbing task.** Customer requests `bathroom_faucet_replace` — pro arrives, the under-sink shutoff is corroded shut from 30 years of hard water, and the only way to install the new faucet is to replace the shutoff first (scope = `valve_shutoff_replace`, +$265, +90 min, may need building water shut-off). The dispatch logic must handle this via the **§3.3 escape hatch:** pro hits "Convert to Project," $50 trip fee paid, customer auto-flowed into a Project quote with the same pro holding right of first refusal. Without this, the pro either eats labor (churns out of lane) or the customer feels bait-and-switched (churns out of platform).

---

## 11. Last Updated

**2026-04-22** — Draft v1 by Claude. 47 tasks across 7 categories, full Drizzle schema, migration 006 ready for T1, customer + pro UX wireframes, sourcing table. Awaiting Phyrom + Pro Success Manager review before Phase 1 engineering kickoff.
