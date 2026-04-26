---
title: Hub #1 Atkinson NH - Real Estate Confirmation Memo
date: 2026-04-25
status: draft
owner: Phyrom
hub: Hub #1 Atkinson NH
phase: Phase 1, Month 0-1
references:
  - docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md
  - docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md
  - docs/superpowers/plans/2026-04-25-sherpa-hub-integration-plan.md (WS1.1)
---

# Hub #1 Atkinson NH - Real Estate Confirmation Memo

## Purpose

Confirm that the HJD Builders LLC HQ facility in Atkinson NH satisfies the Phase 1 Sherpa Hub real-estate requirements. This memo serves as the operational baseline for the Franchise Disclosure Document (FDD) per the parallel Franchise Model spec, and as the input to the WS1.2 fit-out plan.

**Site address:** HJD Builders LLC HQ, Atkinson NH (street address to be inserted by Phyrom on signoff).

**Site control:** Owned/controlled by HJD Builders LLC (Phyrom). Zero-cost colocation per integration spec section 9 (Hub #1 capex floor ~$60K driven by zero real-estate burden).

---

## 1. Square Footage Assessment

**Target Hub footprint:** 1,800-2,400 square feet within HJD HQ.

**Allocation breakdown (per April 15 Hub model spec, scaled to 2,000 sq ft baseline):**

| Zone | Target sq ft | % | Notes |
|---|---|---|---|
| Warehouse / staging / racking | 1,000-1,200 | 50-55% | Bulk rack, kit assembly, tool cage, Sherpa Materials staging racks |
| Showroom / pickup counter | 350-450 | 18-20% | POS counter, pickup window, demo wall, kiosk |
| Member lounge | 250-350 | 12-15% | Coffee, seating, casual community space |
| Training room | 200-300 | 10-12% | 12-seat classroom, demo benches (deferrable to Phase 2 if HQ space tight) |
| Restroom + utility + circulation | 100-150 | 5-8% | ADA-compliant restroom required for member access |

### Walk-through checklist

- [ ] Measure exact usable square footage of the target HQ bay (length x width, deduct columns + obstructions)
- [ ] Confirm minimum 1,800 sq ft contiguous, with 2,400 sq ft preferred
- [ ] Identify partition wall locations to separate Hub from non-Hub HQ operations
- [ ] Document ceiling height (target: 14 ft minimum for racking + lighting)
- [ ] Photograph all four walls, floor, ceiling, dock area, exterior approach

---

## 2. Zoning Verification

**Town:** Town of Atkinson, NH
**County:** Rockingham County, NH

### Zoning checklist

- [ ] Pull current zoning designation for HJD HQ parcel from Town of Atkinson Planning Office
- [ ] Confirm wholesale / contractor / supply / mixed-use is permitted by-right
- [ ] If special exception or variance required, document path + timeline
- [ ] Confirm pro-only access model (no public retail) does not trigger retail-zoning conflict
- [ ] Confirm signage allowance (size, illumination, setback) per Atkinson sign ordinance
- [ ] Check for any HOA, restrictive covenant, or shared-driveway easement that affects use
- [ ] If Hub triggers a change-of-use designation, file with Town Planner before fit-out start

**Risk flag:** Atkinson is a small NH town. Zoning officials are often part-time. Build 2-week lead time into the calendar for any zoning question that requires Planning Board review.

---

## 3. HVAC + Electrical Load Assessment

### Electrical

- [ ] Confirm 200A panel service available to the Hub footprint (target: 400A if training room A/V + 8-camera security + kiosks + POS + 12 lighting zones run concurrently)
- [ ] Confirm 6 dedicated 20A circuits available for: POS counter (1), security NVR (1), training A/V (1), member-lounge appliances (1), kit-assembly bench tools (2)
- [ ] Confirm 1 dedicated 30A circuit if any 240V tool-demo equipment is planned
- [ ] Photograph existing panel + document spare slot availability
- [ ] If panel upgrade needed: scope cost into fit-out budget (typical $4-8K for 200A->400A in NH)

### HVAC

- [ ] Confirm existing HVAC capacity covers Hub footprint year-round (NH winters require heat in warehouse zones to prevent inventory freeze damage on plumbing fittings)
- [ ] Target zoning: warehouse (55-65F minimum), showroom + lounge + training (68-72F)
- [ ] If existing HVAC insufficient: scope split-zone mini-split add into fit-out budget ($6-12K)
- [ ] Confirm ventilation adequate for member-lounge occupancy (assume 12 concurrent users at peak)

### Plumbing

- [ ] Confirm sink in receiving / kit-assembly area (handwash, parts cleanup)
- [ ] Confirm restroom is ADA-compliant or scope renovation into fit-out budget
- [ ] Confirm hot water available

---

## 4. Parking Capacity

**Target:** 8-12 dedicated Hub parking spots (separate from HJD HQ staff parking).

| User | Spots needed |
|---|---|
| Hub Manager + Hub Associate (staff) | 2-3 |
| Member pickup-by-pro (peak: 6am-12pm) | 4-6 |
| Training-event attendees (peak: Tue/Thu 6-8pm) | 12 (overflow OK during training; daytime overlap minimal) |
| Uber Direct drivers (loading, ~5-10 min dwell) | 1-2 designated short-term loading |
| Supplier delivery dock (FW Webb, Grainger, Zinc-coordinated freight) | 1 dock + 1 truck staging |

### Parking checklist

- [ ] Count existing HJD HQ parking, allocate 8-12 spots minimum to Hub
- [ ] Designate 1-2 spots as "Uber Direct loading - 10 min" with signage
- [ ] Designate 2 spots as "Hub Manager / Staff"
- [ ] Designate 1 spot as ADA-accessible
- [ ] Confirm Tuesday/Thursday training-event overflow plan (HJD lot accommodates 25+ vehicles during 6-8pm window)
- [ ] Confirm winter snow storage does not eat into Hub member spots

---

## 5. Member Access Flow

**Pro-only access model.** No public foot traffic. Per integration spec section 6 security playbook: keypad + member badge entry, all access logged to `hub_access_log`.

### Access flow checklist

- [ ] Identify member-entry door (separate from staff/receiving entry)
- [ ] Install keypad + badge reader at member-entry door
- [ ] Member entry path: parking -> entry door -> showroom / pickup counter -> (optional) member lounge / training room
- [ ] Receiving / dock door physically separated and not member-accessible
- [ ] Tool cage physically separated and accessed only by staff during transactions
- [ ] After-hours: keypad allows Founding Pros + Gold tier access to member lounge only (Phase 3+ feature, defer for Phase 1)

---

## 6. Materials Staging Area

Per integration spec section 8, the Hub is the last-mile staging warehouse for Sherpa Materials. Staging area must support 4 daily Uber Direct waves (6:30am, 8:00am, 10:00am, 12:00pm) plus pro-pickup option.

### Staging area checklist

- [ ] Designate 600-800 sq ft contiguous racking zone for job-labeled staging racks
- [ ] Plan 24-36 staging rack positions (1 rack per active job-day, average 18-24 jobs staged at peak)
- [ ] Each rack labeled: job ID, pro name, dispatch wave, dispatch method (printed label + QR scan)
- [ ] Receiving dock adjacent to staging zone (minimize internal-handling distance)
- [ ] Dock-to-rack workflow: forklift / pallet jack accessible, clear floor path
- [ ] Staging zone within 30 ft of pickup-counter window (for pro pickup) and within 30 ft of dock door (for Uber Direct loadout)

---

## 7. Cost-of-Goods-Sold Lockup (Inventory Cage)

Top-200 SKU buffer stock + tool rental cage are high-shrink risk and require physical separation.

### Lockup checklist

- [ ] Designate 200-300 sq ft tool cage with steel mesh walls + locked door (key control: Hub Manager + 1 designated Associate)
- [ ] Tool cage RFID infrastructure for rental fleet tracking (per integration spec section 6 security playbook)
- [ ] Designate 200-300 sq ft buffer-stock cage / racking with controlled access (member badge does NOT open this; staff escort only)
- [ ] Camera coverage on tool cage entry + buffer-stock entry (mandatory per security playbook)
- [ ] Reorder threshold signage on each SKU bin

---

## 8. Member Lounge Layout

Per April 15 Hub model spec - member lounge is a community / retention amenity, not a transactional space.

### Lounge layout checklist

- [ ] 250-350 sq ft footprint
- [ ] 8-12 seats (mix of bar stools, lounge chairs, work-table seating)
- [ ] 1 communal work table (8-10 person)
- [ ] Coffee station (drip + espresso machine + supplies)
- [ ] Wi-Fi (member-tier SSID, password rotated quarterly)
- [ ] 1 large monitor / TV for Sherpa Pros marketplace dashboard / training event promo loop
- [ ] Locker bank: 24 day-use lockers (per equipment manifest)
- [ ] Charging stations (USB-C + standard outlets at every seat)
- [ ] Branded wall art / Sherpa Pros visual identity (per brand portfolio doc)

---

## 9. Signage Placement

### Exterior signage

- [ ] Street-facing primary sign: "Sherpa Hub - Atkinson NH" (logo + text, target 6-8 ft wide, illuminated per Atkinson sign ordinance)
- [ ] Building-mounted secondary sign: at member entry door, identifying Hub
- [ ] Wayfinding sign at parking entry: "Sherpa Hub Member Parking ->"
- [ ] Receiving dock sign: "Deliveries - FW Webb / Grainger / Zinc" (suppliers identify the right dock)

### Interior signage

- [ ] Member entry: welcome / member onboarding QR
- [ ] Showroom: zone signage (Pickup / Tool Rental / Training / Lounge)
- [ ] Tool cage: "Staff Access Only"
- [ ] Buffer stock: "Staff Access Only"
- [ ] Restroom: ADA-compliant signage
- [ ] Emergency exit + fire extinguisher signage (per NH commercial code)
- [ ] After-hours member access instructions (Phase 3+ feature, placeholder for now)

### Signage permit

- [ ] File signage permit with Town of Atkinson (covered in `04-permit-checklist-nh.md`)

---

## 10. Sign-off

- [ ] Phyrom walk-through complete
- [ ] All measurements captured + photographed
- [ ] Floor plan sketch attached (hand-drawn acceptable per WS1.1)
- [ ] Zoning verified
- [ ] Electrical + HVAC + plumbing assessed
- [ ] Parking allocated
- [ ] Document signed by Phyrom and dated

**Next step on signoff:** Hand off to architect engagement (file `02-architect-engagement-rfp.md`) for as-built drawings and permit-ready plans.
