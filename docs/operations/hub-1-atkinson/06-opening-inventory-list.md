---
title: Hub #1 Atkinson NH - Opening Inventory List (Top-200 SKU Buffer Stock)
date: 2026-04-25
status: draft
owner: Phyrom + Hub Manager #1 (when hired)
hub: Hub #1 Atkinson NH
phase: Phase 1, Month 3
budget_target: $25,000 - $30,000
references:
  - docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (section 3, section 8 routing rules, top-200 SKU lock)
  - docs/superpowers/plans/2026-04-25-sherpa-hub-integration-plan.md (WS1.4, WS3.8)
  - docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md (kit catalog)
---

# Hub #1 Atkinson NH - Opening Inventory List

## Purpose

Define the top-200 Stock Keeping Unit (SKU) buffer-stock list for Hub #1 launch. This buffer enables same-hour fulfillment for high-frequency parts on jobs within the Hub catchment radius (45-minute drive), per integration spec section 8 routing rule "hub_buffer."

**Phase 1 launch starts with top 50 SKUs** (per integration spec section 8 SKU lock cadence) and ramps to full top 200 by Phase 2 as throughput data emerges. This document scopes the full top-200 plan; Hub Manager #1 narrows to the actual launch top-50 in WS3.8 with Phyrom signoff.

**Budget target: $25,000 - $30,000 opening inventory.**

---

## 1. Category Allocation

| Category | SKU Count | Budget Allocation | Rationale |
|---|---|---|---|
| Rough plumbing | 50 | $8,500 (~34%) | Highest-velocity category in NH/MA/ME job mix; FW Webb is the primary supplier and the partnership-default per integration spec section 4 |
| Rough electrical | 40 | $6,000 (~24%) | Second-highest velocity; Grainger + Home Depot Pro mix |
| Fasteners | 30 | $1,800 (~7%) | Low unit cost, high turnover, simple to stock |
| Drywall + insulation | 20 | $2,500 (~10%) | Bulky, difficult to ship in small quantities; Hub buffer reduces last-mile cost dramatically |
| Framing | 20 | $2,200 (~9%) | Studs, lumber-cuts, hangers, common framing hardware |
| Trim + finish | 20 | $1,800 (~7%) | Caulk, paint sundries, finish nails, trim adhesive |
| HVAC components | 10 | $1,200 (~5%) | Filters, basic duct hardware, condensate components |
| Miscellaneous (PPE, blades, batteries, tarps) | 10 | $800 (~3%) | High-velocity job-day grab items |
| **Total** | **200** | **$24,800** | |
| Contingency (variance + first-restock) | | $3,000 | |
| **Total with contingency** | | **$27,800** | |

---

## 2. SKU Specification Template

Each SKU on the buffer-stock list is specified with the following data points (stored in `hub_inventory` table per April 15 Hub model spec):

| Field | Description |
|---|---|
| SKU | Sherpa internal SKU + supplier SKU cross-reference |
| Description | Plain-language part name |
| Category | One of 8 categories above |
| Supplier | Primary (FW Webb / Grainger / Home Depot Pro / direct) |
| Backup supplier | Secondary supplier if primary out of stock |
| Unit cost | Wholesale cost per unit |
| MOQ | Minimum order quantity (per supplier) |
| Opening stock | Quantity at Hub launch |
| Reorder point | Trigger threshold (qty on hand) |
| Reorder quantity | Standard reorder lot |
| Supplier lead time | Days from order to receipt |
| Margin to Hub | Per integration spec section 8 (40% on hub_buffer flow) |

---

## 3. Rough Plumbing (50 SKUs, ~$8,500)

Primary supplier: **FW Webb** (per integration spec section 4 default-supplier mechanic).

### High-frequency (top 25)
- [ ] 1/2" copper Type L pipe, 10 ft sticks - opening 30, reorder @ 10 / +20
- [ ] 3/4" copper Type L pipe, 10 ft sticks - opening 20, reorder @ 8 / +15
- [ ] 1/2" PEX-A tubing, 100 ft coils - opening 6, reorder @ 2 / +4
- [ ] 3/4" PEX-A tubing, 100 ft coils - opening 4, reorder @ 2 / +3
- [ ] 1/2" PEX-A elbows (lot of 25) - opening 4 lots
- [ ] 3/4" PEX-A elbows (lot of 25) - opening 3 lots
- [ ] 1/2" PEX-A tees (lot of 25) - opening 4 lots
- [ ] 3/4" PEX-A tees (lot of 25) - opening 3 lots
- [ ] 1/2" PEX expansion sleeves (lot of 100) - opening 3
- [ ] 3/4" PEX expansion sleeves (lot of 100) - opening 2
- [ ] 1/2" copper 90 elbow C x C (lot of 25) - opening 4
- [ ] 1/2" copper tee C x C x C (lot of 25) - opening 4
- [ ] 3/4" copper 90 elbow C x C (lot of 25) - opening 3
- [ ] 3/4" copper tee C x C x C (lot of 25) - opening 3
- [ ] 1-1/2" Schedule 40 PVC pipe, 10 ft - opening 12
- [ ] 2" Schedule 40 PVC pipe, 10 ft - opening 12
- [ ] 3" Schedule 40 PVC pipe, 10 ft - opening 8
- [ ] 4" Schedule 40 PVC pipe, 10 ft - opening 6
- [ ] 1-1/2" PVC sanitary tee (lot of 10) - opening 2
- [ ] 2" PVC sanitary tee (lot of 10) - opening 2
- [ ] 3" PVC sanitary tee (lot of 10) - opening 2
- [ ] PVC primer + cement combo (4 oz + 4 oz) - opening 12
- [ ] Pipe dope, 4 oz - opening 12
- [ ] Teflon tape, 1/2" x 520" - opening 24
- [ ] Solder + flux kit (lead-free, 1 lb spool) - opening 6

### Mid-frequency (next 25)
- [ ] Shutoff valves: 1/2" + 3/4" + 1" angle stop, ball valve, gate valve (12 SKUs across sizes)
- [ ] Toilet supply lines (12" + 20" braided, lot of 6) - 4 lots
- [ ] Toilet flanges (PVC + cast iron, 3" + 4") - 4 SKUs
- [ ] Wax rings (lot of 10) - 4 lots
- [ ] P-traps (1-1/4" + 1-1/2" PVC + chrome, 4 SKUs)
- [ ] Sink drain assemblies (4 SKUs)
- [ ] Faucet supply lines (lavatory + kitchen, 3 SKUs)
- [ ] Pipe insulation (1/2" + 3/4" + 1", 6 ft sticks) - 6 SKUs
- [ ] Hangers + straps (copper + PEX, 4 SKUs)

---

## 4. Rough Electrical (40 SKUs, ~$6,000)

Primary suppliers: **Grainger + Home Depot Pro + FW Webb electrical division**.

### High-frequency
- [ ] 12/2 NM-B Romex, 250 ft roll - opening 8
- [ ] 14/2 NM-B Romex, 250 ft roll - opening 8
- [ ] 12/3 NM-B Romex, 250 ft roll - opening 4
- [ ] 14/3 NM-B Romex, 250 ft roll - opening 4
- [ ] 6/3 NM-B Romex, 100 ft - opening 2
- [ ] 1/2" EMT conduit, 10 ft - opening 30
- [ ] 3/4" EMT conduit, 10 ft - opening 20
- [ ] EMT couplings + connectors (lot of 25) - 4 SKUs across sizes
- [ ] 1/2" PVC conduit, 10 ft - opening 20
- [ ] 3/4" PVC conduit, 10 ft - opening 15
- [ ] Duplex receptacles, residential grade (lot of 10) - opening 8 lots
- [ ] Duplex receptacles, commercial spec grade (lot of 10) - opening 4 lots
- [ ] GFCI receptacles (lot of 10) - opening 6 lots
- [ ] Single-pole switches (lot of 10) - opening 6 lots
- [ ] 3-way switches (lot of 10) - opening 4 lots
- [ ] Single-gang plastic boxes (lot of 25) - opening 4 lots
- [ ] Double-gang plastic boxes (lot of 25) - opening 3 lots
- [ ] Single-gang metal boxes (lot of 25) - opening 3 lots
- [ ] Octagon ceiling boxes (lot of 25) - opening 3 lots
- [ ] Wire nuts (red + yellow + grey + orange, jar of 100) - 4 SKUs

### Mid-frequency
- [ ] Breakers: 15A + 20A + 30A single-pole, 30A + 40A + 50A double-pole (8 SKUs across common Square D + Eaton)
- [ ] White + ivory cover plates (lot of 10, 4 SKUs)
- [ ] Romex staples (lot of 100) - 2 SKUs
- [ ] Cable clamps + connectors (4 SKUs)
- [ ] Recessed can lights (4" + 6" LED retrofit) - 2 SKUs
- [ ] Smoke + CO detectors (hardwired + battery) - 2 SKUs

---

## 5. Fasteners (30 SKUs, ~$1,800)

Primary supplier: **Grainger + Home Depot Pro + Fastenal**.

- [ ] Drywall screws (1-1/4" + 1-5/8" + 2", coarse + fine thread, 5 lb tubs) - 6 SKUs
- [ ] Deck screws (2-1/2" + 3", coated, 5 lb tubs) - 4 SKUs
- [ ] Construction screws (Spax / GRK 2-1/2" + 3-1/2" + 4", 1 lb boxes) - 4 SKUs
- [ ] Wood screws (#8 x 1-1/4" + #10 x 2", boxes of 100) - 4 SKUs
- [ ] Lag screws (3/8" x 4" + 1/2" x 6", boxes of 25) - 2 SKUs
- [ ] Carriage bolts assortment - 1 SKU (graded kit)
- [ ] Sheet-metal screws (lot assortment) - 1 SKU
- [ ] Concrete anchors (Tapcon 1/4" + 3/8") - 2 SKUs
- [ ] Wedge anchors (1/2" + 5/8") - 2 SKUs
- [ ] Common nails (8d + 16d, 5 lb boxes) - 2 SKUs
- [ ] Finish nails (15ga + 16ga + 18ga collated for nailers) - 2 SKUs

---

## 6. Drywall + Insulation (20 SKUs, ~$2,500)

Primary suppliers: **Home Depot Pro + FW Webb (drywall not Webb's strength but stocks select)**.

- [ ] 1/2" drywall, 4x8 sheets - opening 50
- [ ] 5/8" Type X drywall, 4x8 sheets - opening 30
- [ ] 1/2" moisture-resistant drywall (greenboard), 4x8 - opening 20
- [ ] Joint compound (5-gallon all-purpose) - opening 12
- [ ] Joint compound (5-gallon lightweight) - opening 8
- [ ] Drywall tape (paper, 250 ft roll) - opening 24
- [ ] Mesh tape (300 ft roll) - opening 12
- [ ] Corner bead (metal, 8 ft) - opening 30
- [ ] R-13 batt insulation, 16" oc, 88 sq ft bag - opening 20
- [ ] R-19 batt insulation, 16" oc, 75 sq ft bag - opening 12
- [ ] R-30 batt insulation, 16" oc, 64 sq ft bag - opening 8
- [ ] R-15 batt mineral wool, 16" oc - opening 8
- [ ] Spray foam (closed-cell, 24 oz can) - opening 24
- [ ] Window + door foam (low-expansion) - opening 24
- [ ] Drywall sanding sponges - opening 24
- [ ] Drywall sanding screens (assorted grit) - opening 24
- [ ] Sander pole + head - opening 4
- [ ] Mud pans (12") - opening 12
- [ ] Taping knives (4" + 6" + 10") - opening 12
- [ ] Hawk + trowel set - opening 4

---

## 7. Framing (20 SKUs, ~$2,200)

Primary supplier: **local lumberyard + Home Depot Pro**.

- [ ] 2x4 SPF studs, 8 ft (precut) - opening 60
- [ ] 2x4 SPF studs, 92-5/8" precut - opening 60
- [ ] 2x4 SPF, 10 ft - opening 30
- [ ] 2x6 SPF, 8 ft - opening 30
- [ ] 2x6 SPF, 10 ft - opening 20
- [ ] 2x8 SPF, 10 ft - opening 12
- [ ] 1/2" CDX plywood, 4x8 - opening 20
- [ ] 5/8" CDX plywood, 4x8 - opening 15
- [ ] 3/4" CDX plywood, 4x8 - opening 12
- [ ] OSB 7/16", 4x8 - opening 30
- [ ] LVL 1-3/4" x 9-1/4" x 12 ft - opening 6
- [ ] LVL 1-3/4" x 11-7/8" x 14 ft - opening 4
- [ ] Joist hangers (Simpson LUS24 + LUS28, lot of 25) - 2 SKUs
- [ ] Hurricane ties (Simpson H2.5A, lot of 50) - opening 4
- [ ] Stud shoes / plates (lot of 50) - 1 SKU
- [ ] Sill seal foam (5-1/2" x 50 ft roll) - opening 6
- [ ] Pressure-treated 2x6 sill plate, 8 ft - opening 20
- [ ] House wrap (Tyvek, 9 ft x 100 ft roll) - opening 4
- [ ] Tyvek tape (3" x 165 ft) - opening 12
- [ ] Z-flashing (10 ft) - opening 12

---

## 8. Trim + Finish (20 SKUs, ~$1,800)

- [ ] Latex caulk (white + clear, 10 oz) - 4 SKUs
- [ ] Silicone caulk (kitchen + bath, 10 oz) - 2 SKUs
- [ ] Construction adhesive (PL Premium, 10 oz) - 1 SKU
- [ ] Wood glue (Titebond III, 16 oz) - 1 SKU
- [ ] Spackle (1 qt + 1 gal) - 2 SKUs
- [ ] Wood putty (assorted colors, 4 oz) - 4 SKUs
- [ ] Sanding sponges (medium + fine) - 2 SKUs
- [ ] Sandpaper assortment (60-220 grit, 5 packs) - 4 SKUs
- [ ] Painter's tape (FrogTape 1.5" + 2", 60 yd) - 2 SKUs
- [ ] Drop cloths (canvas 9x12 + plastic 12x15) - 2 SKUs
- [ ] Roller covers (3/8" + 1/2" + 3/4" nap, 9") - 3 SKUs
- [ ] Roller frames + handles + extension pole - 3 SKUs
- [ ] Brushes (2" + 2.5" + 3" sash + 4") - 4 SKUs
- [ ] Paint trays + liners - 2 SKUs
- [ ] Finish nails 16ga + 18ga, collated for nailer (2 SKUs)
- [ ] Trim screws (3" trim head, 1 lb) - 1 SKU
- [ ] Casing nails (lot of 100) - 1 SKU

---

## 9. HVAC Components (10 SKUs, ~$1,200)

Primary supplier: **FW Webb HVAC division**.

- [ ] HVAC filters (16x20x1 + 16x25x1 + 20x25x1 + 20x25x4 high-efficiency, lot of 6) - 4 SKUs
- [ ] Condensate line (3/4" PVC, fittings) - 2 SKUs
- [ ] Aluminum foil tape (HVAC, 2.5" x 60 yd) - 1 SKU
- [ ] Mastic sealant (gallon) - 1 SKU
- [ ] Flex duct (8" x 25 ft + 6" x 25 ft) - 2 SKUs

---

## 10. Miscellaneous PPE + Sundries (10 SKUs, ~$800)

- [ ] Nitrile gloves (large + XL, box of 100) - 2 SKUs
- [ ] N95 respirators (box of 20) - 1 SKU
- [ ] Safety glasses (lot of 12) - 1 SKU
- [ ] Knee pads (gel, pair) - 1 SKU
- [ ] Utility blades (Stanley, 100-pack) - 1 SKU
- [ ] Pencils (carpenter, 12-pack) - 1 SKU
- [ ] Chalk lines + chalk refills (red + blue) - 1 SKU
- [ ] Tarps (8x10 + 12x16) - 2 SKUs

---

## 11. Pre-Built Kit Inventory (per April 15 spec)

In addition to the 200 SKU buffer, opening inventory includes 5 of each of the 10 kit categories from the April 15 Hub model spec, pre-assembled and shelved in the showroom for instant pickup. Kit-level cost is included in the $27,800 budget total above.

- [ ] Rough plumbing kit (5 units)
- [ ] Rough electrical kit (5 units)
- [ ] Drywall hang + finish kit (5 units)
- [ ] Trim install kit (5 units)
- [ ] Bathroom rough kit (5 units)
- [ ] Kitchen rough kit (5 units)
- [ ] Deck framing kit (5 units)
- [ ] Window install kit (5 units)
- [ ] Door install kit (5 units)
- [ ] Punch-list / fix-it kit (5 units)

---

## 12. Reorder Triggers + Supplier Cadence

Per integration spec section 6 daily operations, end-of-day spot count of top-50 SKUs triggers reorder. Supplier cadence:
- **FW Webb:** next-day delivery (in-stock items), branch will-call available
- **Grainger:** next-day or same-day for stocked SKUs
- **Home Depot Pro:** Pro Desk standing order, 1-3 days
- **Fastenal:** 2-3 day reorder cycle
- **Local lumberyard:** next-day
- **Direct ship from manufacturer:** 5-10 days (used for low-velocity / specialty items only)

---

## 13. Sign-off

- [ ] Top-200 SKU list reviewed by Phyrom
- [ ] Hub Manager #1 narrows to launch top-50 (per WS3.8) for soft-open
- [ ] Supplier MOQs confirmed
- [ ] Opening orders placed in Wave 2 of equipment ordering (per `05-equipment-manifest.md` schedule)
- [ ] Inventory loaded into `hub_inventory` table before soft-open day
- [ ] Restock cadence documented in Hub runbook
