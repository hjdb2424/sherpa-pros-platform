---
title: Hub #1 Atkinson NH - Equipment Manifest
date: 2026-04-25
status: draft
owner: Phyrom
hub: Hub #1 Atkinson NH
phase: Phase 1, Months 2-3
budget_target: $55,000 - $65,000 (separate from build-out + inventory)
references:
  - docs/operations/hub-1-atkinson/01-real-estate-confirmation.md
  - docs/operations/hub-1-atkinson/03-contractor-rfp-and-criteria.md
  - docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (section 6 security playbook, section 7 data model)
  - docs/superpowers/specs/2026-04-15-sherpa-hub-model-design.md
---

# Hub #1 Atkinson NH - Equipment Manifest

## Purpose

Comprehensive list of fixtures, furnishings, equipment (FF&E), IT, security, signage, and materials-handling assets required to make Hub #1 operational. Excludes construction build-out (per `03-contractor-rfp-and-criteria.md`) and opening inventory (per `06-opening-inventory-list.md`).

**Total budget target: $55,000 - $65,000.**

Order in waves to align with build schedule:
- Wave 1 (Month 2): Long-lead items (security cameras + NVR, racking, signage fabrication, training A/V, locker bank)
- Wave 2 (Month 3 early): Network + IT, POS hardware, member-lounge furniture, materials-handling equipment
- Wave 3 (Month 3 late): Office finishes, copier, sundries

---

## 1. Point of Sale + Payment Processing (~$2,000)

Per integration spec section 14 Open Decision #6, build on existing Drizzle/Postgres stack for Phase 1-2; revisit retail POS at Phase 4 scale. POS hardware below is hardware-only - software runs on existing platform.

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Counter terminal (touchscreen, Windows or iPad-based) | 1 | $750 | $750 | Square Hardware or Toast | 1 wk |
| Mobile barcode scanner (Bluetooth, ruggedized) | 2 | $180 | $360 | Honeywell or Zebra | 1 wk |
| Receipt printer (thermal, USB + Ethernet) | 1 | $280 | $280 | Star Micronics | 1 wk |
| Card reader (Stripe Terminal or Square Reader) | 2 | $200 | $400 | Stripe / Square | 1 wk |
| Cash drawer (electronic release, lockable) | 1 | $150 | $150 | APG | 1 wk |
| Backup printer (label printer for kit + rack labels) | 1 | $200 | $200 | DYMO LabelWriter | 1 wk |
| **POS subtotal** | | | **$2,140** | | |

---

## 2. Inventory Management System (~$1,500 initial)

Software runs on existing Drizzle/Postgres stack. Costs below are hardware + first-year subscription where applicable.

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Bin labels + label printer ribbons (1-year supply) | 1 | $300 | $300 | Avery / DYMO | 1 wk |
| Cycle-count tablets (Android, ruggedized) | 2 | $400 | $800 | Lenovo / Samsung | 2 wk |
| RFID handheld reader (for rental fleet ping) | 1 | $400 | $400 | Zebra MC3300 | 3 wk |
| **Inventory subtotal** | | | **$1,500** | | |

---

## 3. IT Infrastructure (~$8,000)

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Business-grade router + firewall (UniFi Dream Machine Pro or pfSense appliance) | 1 | $500 | $500 | Ubiquiti | 1 wk |
| Managed PoE switch (24-port, gigabit) | 1 | $400 | $400 | Ubiquiti / Netgear | 1 wk |
| Wi-Fi access points (UniFi U6-LR or similar, ceiling mount) | 3 | $200 | $600 | Ubiquiti | 1 wk |
| Staff desktop workstations (mid-tier, Windows 11 Pro or Mac mini) | 4 | $1,000 | $4,000 | Dell / Apple | 2 wk |
| Customer-facing kiosks (24" touchscreen all-in-one for showroom self-serve catalog browse) | 2 | $1,000 | $2,000 | Lenovo / Elo | 3 wk |
| UPS (uninterruptible power supplies, for POS + NVR + router rack) | 2 | $250 | $500 | APC / CyberPower | 1 wk |
| **IT subtotal** | | | **$8,000** | | |

---

## 4. Security (~$6,000)

Per integration spec section 6 security playbook: 8-camera IP setup, NVR + cloud retention, RFID on rental tools, access control (badge + keypad).

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| IP cameras (8-camera, PoE, 4K, indoor + 2 outdoor weatherized) | 8 | $250 | $2,000 | Reolink / Axis | 2 wk |
| NVR (network video recorder, 8-channel, 4TB local storage) | 1 | $700 | $700 | Reolink / Synology | 2 wk |
| Cloud retention subscription (30-day cloud, 90-day local) - Year 1 | 1 | $480 | $480 | Eagle Eye / Verkada | recurring |
| Alarm panel + door/window contacts + motion sensors | 1 | $600 | $600 | Honeywell / DSC | 2 wk |
| Alarm monitoring service (Year 1) | 1 | $360 | $360 | National monitoring center | recurring |
| Access control: keypad + badge reader at member entry | 1 | $700 | $700 | HID / SALTO | 3 wk |
| Member badges (RFID cards, branded, lot of 100 for first year) | 100 | $4 | $400 | HID | 3 wk |
| RFID tags for rental tool fleet (200 tags) | 200 | $3 | $600 | Zebra / GAO | 2 wk |
| Deposit safe (drop-slot, fireproof) | 1 | $300 | $300 | SentrySafe | 1 wk |
| **Security subtotal** | | | **$6,140** | | |

---

## 5. Signage (~$8,000)

Designed by architect (per `02-architect-engagement-rfp.md` deliverable 1.5), fabricated by signage vendor, installed by GC (per `03-contractor-rfp-and-criteria.md` scope 2.8) or signage installer.

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Exterior primary sign (illuminated channel letters or backlit panel, 6-8 ft wide) | 1 | $4,500 | $4,500 | Local NH signage shop (FastSigns / Signarama) | 6 wk |
| Building-mounted secondary sign (member-entry door, ~3 ft) | 1 | $800 | $800 | Same | 4 wk |
| Wayfinding signs (parking arrow + dock sign + member parking) | 4 | $200 | $800 | Same | 3 wk |
| Interior zone signs (Pickup / Tool Rental / Training / Lounge / Restroom) | 8 | $120 | $960 | Same | 3 wk |
| Tool cage + buffer stock "Staff Only" signs | 4 | $80 | $320 | Same | 3 wk |
| Emergency / egress signage (per fire department spec, GC-installed) | lot | $400 | $400 | GC pass-through | with build |
| Branded wall graphics (member lounge feature wall + brand identity) | 1 | $400 | $400 | Local print shop | 4 wk |
| **Signage subtotal** | | | **$8,180** | | |

---

## 6. Furniture (~$15,000)

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Member-lounge bar stools (durable, contractor-friendly) | 6 | $180 | $1,080 | Wayfair Business / NBF | 2 wk |
| Member-lounge lounge chairs | 4 | $350 | $1,400 | Wayfair Business / NBF | 3 wk |
| Communal work table (8-10 person, hardwood, 8 ft) | 1 | $1,200 | $1,200 | NBF / Crate Barrel Business | 4 wk |
| Coffee station (espresso machine + drip + grinder + supplies) | 1 | $1,500 | $1,500 | Breville / commercial espresso | 2 wk |
| Member day-use lockers (24-bank, padlock or RFID-ready) | 1 | $2,400 | $2,400 | Lyon / Hallowell | 4 wk |
| Training-room chairs (12-seat, stackable, padded) | 12 | $90 | $1,080 | NBF / Wayfair Business | 2 wk |
| Training-room tables (folding, 6 ft, banquet-style) | 4 | $140 | $560 | NBF | 2 wk |
| Training-room A/V: projector + screen + sound bar + wireless mic kit | 1 | $2,800 | $2,800 | Best Buy Business / B&H | 3 wk |
| Demo bench (training-room, hardwood top, plumbing/electrical demo wired) | 1 | $1,200 | $1,200 | Custom millwork or Greenlee bench | 5 wk |
| Showroom display fixtures (kit display wall, sample boards) | lot | $1,800 | $1,800 | Local store-fixture vendor | 4 wk |
| **Furniture subtotal** | | | **$15,020** | | |

---

## 7. Materials Handling (~$12,000)

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Industrial pallet racking (warehouse zone, 12 sections, 8 ft tall x 8 ft wide x 42" deep) | 12 | $450 | $5,400 | Uline / Global Industrial | 3 wk |
| Job-staging racks (light-duty wire shelving, dedicated rack-by-job-ID) | 24 | $150 | $3,600 | Uline | 2 wk |
| Pallet jack (manual, 5,500 lb capacity) | 1 | $400 | $400 | Uline / Grainger | 1 wk |
| Picking carts (wheeled, 3-tier, 250 lb capacity) | 3 | $250 | $750 | Uline | 1 wk |
| Packing station (table + scanner mount + tape dispensers + box storage) | 1 | $600 | $600 | Custom or Uline | 2 wk |
| Dock plate (hinged, 5,000 lb capacity, for truck-to-dock material flow) | 1 | $700 | $700 | Uline | 2 wk |
| Hand trucks (2-wheel, 600 lb capacity) | 2 | $120 | $240 | Uline / Grainger | 1 wk |
| Tool cage steel mesh + lockable door | 1 | $900 | $900 | Uline / WireCrafters | 4 wk |
| **Materials handling subtotal** | | | **$12,590** | | |

---

## 8. Office (~$3,000)

| Item | Qty | Unit Cost | Total | Supplier | Lead time |
|---|---|---|---|---|---|
| Manager workstation (sit/stand desk + ergonomic chair + dual monitor arms) | 1 | $1,200 | $1,200 | NBF / Uplift | 3 wk |
| File cabinets (lockable, 4-drawer, lateral) | 2 | $350 | $700 | NBF | 2 wk |
| Multifunction copier / printer / scanner (color, network, business-grade) | 1 | $900 | $900 | HP / Brother | 1 wk |
| Office supplies starter pack (paper, toner, pens, binders, etc.) | lot | $300 | $300 | Staples | 1 wk |
| **Office subtotal** | | | **$3,100** | | |

---

## 9. Aggregate Equipment Budget

| Category | Subtotal |
|---|---|
| 1. POS + payment processing | $2,140 |
| 2. Inventory management system | $1,500 |
| 3. IT infrastructure | $8,000 |
| 4. Security | $6,140 |
| 5. Signage | $8,180 |
| 6. Furniture | $15,020 |
| 7. Materials handling | $12,590 |
| 8. Office | $3,100 |
| **Total** | **$56,670** |
| Contingency (10%) | $5,670 |
| **Total with contingency** | **$62,340** |

**Within target $55-65K budget.** Decision points if budget pressure emerges:
- Defer training-room A/V to Phase 2 (-$2,800)
- Defer 2nd customer-facing kiosk to Phase 2 (-$1,000)
- Defer espresso machine, ship with drip-only coffee in Phase 1 (-$1,000)
- Reduce locker bank from 24 to 16 (-$800)

---

## 10. Recurring Costs (Year 1, NOT in capex above)

| Recurring | Annual |
|---|---|
| Cloud video retention | $480 |
| Alarm monitoring | $360 |
| POS / inventory software (built on existing stack, no incremental) | $0 |
| Internet (business-grade fiber, NH) | $1,800 |
| RFID tag replenishment | $200 |
| Member badge replenishment | $200 |
| **Total Year 1 recurring** | **$3,040** |

Recurring costs flow to opex, not capex. Tracked in `09-soft-open-and-grand-open-calendar.md` Month 4+ operating budget.

---

## 11. Sign-off

- [ ] Equipment manifest reviewed by Phyrom
- [ ] Wave 1 long-lead orders placed (security, racking, signage, A/V, lockers)
- [ ] Wave 2 orders placed (network, IT, POS, furniture, materials handling)
- [ ] Wave 3 orders placed (office, sundries)
- [ ] All deliveries scheduled to Hub #1 receiving dock per build schedule
- [ ] Equipment install coordinated with GC final-week schedule
