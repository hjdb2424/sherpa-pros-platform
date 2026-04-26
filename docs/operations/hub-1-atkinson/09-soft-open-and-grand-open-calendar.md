---
title: Hub #1 Atkinson NH - Soft-Open + Grand-Open Calendar
date: 2026-04-25
status: draft
owner: Phyrom
hub: Hub #1 Atkinson NH
phase: Phase 1, Months 0-4
references:
  - docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (section 11 rollout timeline, section 14 Open Decision #1)
  - docs/superpowers/plans/2026-04-25-sherpa-hub-integration-plan.md (WS1.9, WS1.10)
  - docs/operations/hub-1-atkinson/01-real-estate-confirmation.md
  - docs/operations/hub-1-atkinson/02-architect-engagement-rfp.md
  - docs/operations/hub-1-atkinson/03-contractor-rfp-and-criteria.md
  - docs/operations/hub-1-atkinson/04-permit-checklist-nh.md
  - docs/operations/hub-1-atkinson/05-equipment-manifest.md
  - docs/operations/hub-1-atkinson/06-opening-inventory-list.md
  - docs/operations/hub-1-atkinson/07-hub-manager-job-spec.md
  - docs/operations/hub-1-atkinson/08-recruiting-playbook-hub-manager.md
  - docs/operations/hub-1-atkinson/10-pre-open-checklist.md
---

# Hub #1 Atkinson NH - Soft-Open + Grand-Open Calendar

## Purpose

Master milestone calendar for Hub #1 from Month 0 (today, planning kickoff) through Month 4 (grand-open + Sherpa Materials integration go-live). Aligns all 6 workstreams in the integration plan against a single timeline.

**Hub #1 grand-open target:** End of Phase 1 Month 4 (per integration spec section 11). Soft-open begins Month 3 to capture punch-list before grand-open.

Note: Spec section 11 sets grand-open at end of Phase 1 Month 6 in the broader rollout view. Hub #1 calendar below targets a more aggressive 4-month ramp with soft-open Month 3 + grand-open Month 4 because of the HJD HQ colocation advantage (no real estate search, no landlord negotiation, no zoning hurdle). If any critical-path slips, fall back to Month 6 grand-open per spec.

---

## Month 0 (Pre-kickoff month, current month)

### Real estate
- [ ] Phyrom completes site memo (`01-real-estate-confirmation.md`) signoff
- [ ] Floor plan sketch attached
- [ ] Zoning verified with Town of Atkinson Planning

### Architect
- [ ] Architect RFP issued (`02-architect-engagement-rfp.md`)
- [ ] 5+ NH-licensed commercial architects identified
- [ ] RFP responses requested

### Hub Manager recruiting
- [ ] Job spec finalized (`07-hub-manager-job-spec.md`)
- [ ] Recruiting playbook activated (`08-recruiting-playbook-hub-manager.md`)
- [ ] Initial 50-candidate target list built
- [ ] Job posted on LinkedIn / Indeed / NHHBA

### FW Webb partnership (parallel WS2)
- [ ] FW Webb contact list built
- [ ] Intro deck draft initiated

### Insurance
- [ ] Insurance broker outreach initiated (per `docs/superpowers/specs/insurance-broker-outreach.md`)

---

## Month 1

### Architect
- [ ] Architect engagement signed (target Week 2 of Month 1)
- [ ] Site survey + as-built field measure complete
- [ ] As-built drawings delivered
- [ ] Code-compliance memo delivered

### Contractor
- [ ] Contractor RFP issued (`03-contractor-rfp-and-criteria.md`) once architect drawings near permit-ready
- [ ] Bidder list built (5-7 NH GCs)

### Hub Manager recruiting
- [ ] First wave of 25 outreach messages sent
- [ ] Phone screens begin (target: 8-12 completed by end of Month 2)
- [ ] LinkedIn / Indeed / NHHBA posts active

### FW Webb
- [ ] First in-person FW Webb meeting (per integration plan WS2.3)
- [ ] Intro deck v1 ready

### Permits
- [ ] Permit application strategy reviewed with architect
- [ ] Town of Atkinson Building Department first contact (Phyrom or architect)

### Insurance
- [ ] Broker selection complete
- [ ] Insurance application submitted with Hub #1 details

---

## Month 2

### Architect
- [ ] Permit-ready drawings complete (target Week 6 of architect engagement = Week 2 of Month 2)
- [ ] FF&E layout + signage design complete

### Contractor
- [ ] Bid responses received (target 3+ qualified bids)
- [ ] Bid review + GC selection
- [ ] Contract signed
- [ ] Subcontractor list locked

### Permits
- [ ] Building permit submitted to Town of Atkinson
- [ ] Electrical / plumbing / mechanical / signage permits submitted
- [ ] Fire department approval submitted

### Build kickoff
- [ ] Construction kickoff target end of Month 2 (after permits issue, typically 3-4 weeks from submission)

### Hub Manager recruiting
- [ ] Phone screens complete
- [ ] On-site interviews of top 3 candidates
- [ ] Reference checks of finalist

### Equipment
- [ ] Wave 1 long-lead equipment ordered (security, racking, signage fabrication, training A/V, locker bank)

### FW Webb
- [ ] FW Webb LOI draft (per integration plan WS2.4)

### Insurance
- [ ] Policy bound (or quote received + ready to bind on CO issuance)

### POS / inventory system
- [ ] Decision lock: build on existing Drizzle/Postgres stack (per integration spec section 14 Open Decision #6)
- [ ] WS3.2 database migration applied
- [ ] WS3.3 Drizzle schema updated

---

## Month 3

### Build (Weeks 1-4 of Month 3 = Weeks 5-8 of construction)
- [ ] Demo + framing
- [ ] Rough MEP (electrical, plumbing, HVAC) + inspections passed
- [ ] Insulation + drywall
- [ ] Finishes (flooring, paint, ceiling, lighting)
- [ ] Final MEP + final building + fire + signage inspections passed
- [ ] Certificate of Occupancy issued (target end of Month 3)

### Hub Manager
- [ ] Offer signed (per integration spec section 14 Open Decision #3 - target Phase 1 Month 4 in spec; Hub #1 calendar accelerates to Month 3 if recruiting hits stride)
- [ ] Notice period + start date confirmed (target on-floor end of Month 3 or early Month 4)

### Equipment
- [ ] Wave 2 ordered (network, IT, POS, furniture, materials handling)
- [ ] Wave 3 ordered (office, sundries)
- [ ] Equipment delivery scheduled to align with CO issuance + GC final week

### Inventory
- [ ] Top-50 launch SKU list locked (per integration plan WS3.8)
- [ ] Inventory orders placed (FW Webb, Grainger, Home Depot Pro, Fastenal, local lumberyard)
- [ ] Inventory loaded into `hub_inventory` table

### Operational playbook
- [ ] Hub runbook documented (per integration plan WS4.3)
- [ ] Security playbook documented (per integration plan WS4.4)
- [ ] Hub Manager training curriculum documented (per integration plan WS4.1)

### Software
- [ ] Hub Manager dashboard API live (per integration plan WS3.4)
- [ ] Wiseman Materials engine routing logic implemented (per integration plan WS3.5)
- [ ] Zinc API ship-to-Hub configured (per integration plan WS3.6)
- [ ] Uber Direct dispatch-from-Hub configured (per integration plan WS3.7)
- [ ] Pro mobile app Hub features (per integration plan WS3.9)

### FW Webb
- [ ] FW Webb LOI negotiation
- [ ] Target signing late Month 3 / early Month 4 (per integration spec section 4 hard deadline = Phase 1 Month 4)

### Soft-open week (target last week of Month 3)
- [ ] Phyrom + Hub Manager walk-through every system
- [ ] Test transactions, test dispatch, test member checkin
- [ ] Invite 5-10 founding pros (HJD network) to soft-open week
- [ ] Run 2-week controlled-access soft-open
- [ ] Capture punch list + first NPS responses

---

## Month 4

### Soft-open continues + grand-open prep (Weeks 1-2)
- [ ] Continue controlled access (Founding Pros + Gold tier only)
- [ ] Resolve punch list from soft-open
- [ ] Final FW Webb LOI signing (hard deadline)
- [ ] Sherpa Materials Hub-aware routing live + first end-to-end test order completed
- [ ] First weekly Hub Manager dashboard published to HQ Operations

### Grand-open week (target Week 3-4 of Month 4)

#### Marketing push
- [ ] NHHBA press release distributed
- [ ] Local trade press outreach (NH Business Review, Manchester Ink Link, Eagle-Tribune)
- [ ] Social media announcement (LinkedIn + Instagram + Twitter/X)
- [ ] Email blast to all Sherpa Pros database (founding pros + early waitlist)
- [ ] Hub-page on website live with location, hours, member benefits, training calendar
- [ ] Member welcome packet ready (printed, branded, includes badge enrollment QR + Hub map + Q1 training calendar)

#### Grand-open event
- [ ] Schedule date (target a Tuesday or Wednesday for trade-press attention)
- [ ] Hire caterer (sourced from local NH restaurant per `04-permit-checklist-nh.md` Health Department avoidance)
- [ ] Order sponsor swag (branded hats, pens, water bottles, Sherpa Pros tee shirts)
- [ ] Confirm 30+ pro RSVPs
- [ ] Confirm NHHBA representative attendance
- [ ] Confirm 1-2 manufacturer reps (Festool, Hilti, FW Webb) attend with display equipment
- [ ] Run event 4-7pm: ribbon-cut at 4:30pm, tour + member onboarding, demo from sponsor manufacturer at 5:30pm, networking + food + drink

#### Founding member program launches
- [ ] Founding Pro membership (lifetime grandfather, $0/month) issued to event attendees who complete onboarding
- [ ] Member badges issued
- [ ] First-90-day free Hub access (per integration spec section 5) activated for all members

#### Sherpa Materials integration go-live
- [ ] Sherpa Materials Hub-aware routing fully active across all jobs in Hub #1 catchment
- [ ] First production Uber Direct wave dispatches morning of grand-open (or morning following, depending on event timing)
- [ ] First Wave B partnership integration (FW Webb default-supplier) active

### Post-grand-open (Week 4 of Month 4 + Month 5+)
- [ ] Capture grand-open NPS from attendees
- [ ] Capture member-signup rate
- [ ] First-Tuesday monthly P&L review with Phyrom + Hub Manager
- [ ] Begin Q1 training event series (per WS5.2)
- [ ] Begin weekly newsletter cadence (per WS5.5)

---

## Critical-Path Dependencies

| Milestone | Gating |
|---|---|
| Architect engaged | Real-estate signoff (Month 0) |
| Permits issued | Architect drawings + GC selection (Month 2) |
| Construction kickoff | Permits issued (Month 2) |
| CO issued | Construction complete + all final inspections (Month 3) |
| Hub Manager on-floor | Hire signed (Month 3 target, Month 4 acceptable) |
| Soft-open | CO + Hub Manager + equipment + inventory + software (Month 3 late) |
| Grand-open | Soft-open punch list resolved + FW Webb LOI signed + marketing assets ready (Month 4) |
| Sherpa Materials integration go-live | Hub-aware routing built + buffer stock loaded + Hub Manager trained on workflow (Month 4) |

---

## Slip Triggers + Recovery Plan

| Slip | Recovery |
|---|---|
| Architect engagement delayed >2 weeks | Phyrom escalates to backup architect from RFP shortlist |
| Permit issuance delayed >4 weeks | Phyrom + architect meet with Town Building Inspector to identify blockers; if zoning issue surfaces, file variance immediately |
| GC bid responses <3 qualified | Extend RFP 14 days; broaden bidder list to include MA GCs commute-feasible to Atkinson |
| Construction overrun | GC liquidated damages enforced per contract; soft-open shifts 2-4 weeks; grand-open shifts to Month 5 (still within spec section 11 envelope) |
| Hub Manager hire fails by end of Month 3 | Phyrom interim per `08-recruiting-playbook-hub-manager.md` backup plan Option 3 |
| FW Webb LOI not signed by Month 4 | Default Hub #2 + Hub #3 to standalone (per integration spec section 4 hard deadline + recovery plan) |
| Sherpa Materials software not ready by Month 4 | Soft-open + grand-open proceed with member + training + inventory operations only; materials integration delayed 30-60 days |

---

## Sign-off

- [ ] Calendar reviewed by Phyrom
- [ ] All 6 workstreams aligned to milestone dates
- [ ] Critical-path dependencies tracked weekly in Phyrom + Hub Manager status
- [ ] Slip triggers monitored monthly at first-Tuesday P&L review
- [ ] Grand-open date locked by Phase 1 Month 2 (per integration spec section 14 Open Decision #1)
