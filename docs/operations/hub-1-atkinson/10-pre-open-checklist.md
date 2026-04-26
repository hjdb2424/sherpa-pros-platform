---
title: Hub #1 Atkinson NH - Pre-Open Operational Readiness Checklist
date: 2026-04-25
status: draft
owner: Phyrom + Hub Manager #1
hub: Hub #1 Atkinson NH
phase: Phase 1, Month 4 (final 2 weeks before grand-open)
references:
  - docs/operations/hub-1-atkinson/01-real-estate-confirmation.md
  - docs/operations/hub-1-atkinson/04-permit-checklist-nh.md
  - docs/operations/hub-1-atkinson/05-equipment-manifest.md
  - docs/operations/hub-1-atkinson/06-opening-inventory-list.md
  - docs/operations/hub-1-atkinson/07-hub-manager-job-spec.md
  - docs/operations/hub-1-atkinson/09-soft-open-and-grand-open-calendar.md
  - docs/superpowers/specs/insurance-broker-outreach.md
  - docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md (section 6, section 7, section 8)
---

# Hub #1 Atkinson NH - Pre-Open Operational Readiness Checklist

## Purpose

Final go / no-go checklist before Hub #1 grand-open. Every item must be checked off and signed by the owner before grand-open week activates. Items marked "blocking" must be complete; items marked "advisory" can launch with a documented exception.

**Target sign-off:** 7 days before grand-open date.

---

## 1. Insurance (Blocking)

Per integration spec section 6 + insurance-broker-outreach.md.

- [ ] **General Liability bound** ($2M aggregate / $1M per occurrence, target $1,400/year)
- [ ] **Property bound** (building improvements + inventory + equipment, target $1,100/year)
- [ ] **Business Interruption bound** (90-day coverage, target $400/year)
- [ ] **Crime / Employee Dishonesty bound** (target $350/year)
- [ ] **Cyber liability bound** (POS + member data, target $300/year)
- [ ] **Workers Comp bound** for Hub Manager + Hub Associate
- [ ] **Auto / hired-non-owned auto** if Hub uses any vehicle for materials runs
- [ ] **Total Year 1 premium target: ~$3,550** + workers comp + auto
- [ ] Carrier preference: The Hartford or Chubb
- [ ] Master policy structure with per-Hub schedule (so Hub #2+ adds via addendum)
- [ ] Certificate of Insurance on file
- [ ] HJD Builders LLC + Sherpa Pros LLC named as additional insureds where applicable

---

## 2. POS + Inventory + IT Systems (Blocking)

### POS hardware install
- [ ] Counter terminal installed + tested (live transactions)
- [ ] Mobile barcode scanners paired + tested
- [ ] Receipt printer connected + tested
- [ ] Card reader (Stripe Terminal or Square) connected + tested with test transaction
- [ ] Cash drawer installed + tested
- [ ] Label printer (DYMO LabelWriter) installed + ribbons stocked

### Inventory system live
- [ ] `hub_inventory` table loaded with launch top-50 SKUs (per `06-opening-inventory-list.md`)
- [ ] Bin labels printed + applied
- [ ] Cycle-count tablets configured + provisioned to Hub Manager + Hub Associate
- [ ] RFID handheld reader configured for rental fleet ping

### IT infrastructure
- [ ] Business-grade fiber internet active + tested (>100 Mbps down / 50 Mbps up)
- [ ] Router + firewall configured (UniFi Dream Machine Pro or pfSense)
- [ ] PoE switch live with all ports tested
- [ ] 3 Wi-Fi APs covering warehouse + showroom/lounge + training room
- [ ] Member Wi-Fi SSID configured (separate from staff/POS SSID)
- [ ] 4 staff workstations provisioned + accounts created
- [ ] 2 customer-facing kiosks live with showroom self-serve catalog
- [ ] UPS units in place for POS + NVR + router rack

### Software end-to-end test
- [ ] Hub Manager dashboard API live + returning expected JSON shape (per integration spec section 7)
- [ ] Wiseman Materials engine routing logic deployed (per integration plan WS3.5)
- [ ] Zinc API ship-to-Hub configured + tested with mock order
- [ ] Uber Direct dispatch-from-Hub wave grouping logic deployed + tested
- [ ] Pro mobile app Hub features live (nearest Hub, hours, parts in stock, training calendar, pickup-at-Hub toggle)

---

## 3. Security System (Blocking)

### Cameras + NVR
- [ ] All 8 IP cameras installed (5 indoor + 2 outdoor + 1 dock)
- [ ] NVR recording all 8 channels with 4TB local storage
- [ ] 30-day cloud retention subscription active
- [ ] Hub Manager mobile dashboard configured with live camera streams + after-hours motion alerts
- [ ] Camera coverage verified: receiving dock, warehouse aisles, tool cage, pickup counter, showroom, training room, building exterior

### Alarm + access control
- [ ] Alarm panel armed + tested with central monitoring
- [ ] Door + window contacts active + tested
- [ ] Motion sensors live + tested
- [ ] Keypad at member entry tested (codes provisioned for staff)
- [ ] Badge reader at member entry tested with sample member badge
- [ ] Member badges (RFID cards) lot of 100 stocked
- [ ] Tool cage RFID infrastructure live with test rental tag

### Cash + safe
- [ ] Deposit safe installed + tested
- [ ] Cashless POS policy posted at counter
- [ ] If cash accepted: end-of-day cash drop procedure documented + tested

### Access logging
- [ ] `hub_access_log` table receiving badge-in / keypad events
- [ ] First test access events logged + viewable in Hub Manager dashboard

---

## 4. Hub Manager + Hub Associate Trained (Blocking)

### Hub Manager
- [ ] On-floor for at least 14 days before grand-open
- [ ] Completed 2-week onboarding curriculum (per `07-hub-manager-job-spec.md` section 9)
- [ ] Trained on POS, inventory, materials staging workflow, dispatch coordination, returns processing
- [ ] Trained on security playbook + access control + cycle count
- [ ] Has run at least 5 mock dispatch waves
- [ ] Has personally onboarded at least 5 founding pros during soft-open
- [ ] Has signed off on first weekly Hub Manager dashboard report

### Hub Associate
- [ ] Hired + on-floor at least 7 days before grand-open
- [ ] Completed 5-day onboarding curriculum (per integration plan WS4.2)
- [ ] Trained on POS basics, kit assembly, rental check-in/out, member greet protocol
- [ ] Has shadowed Hub Manager on at least 2 morning dispatch waves
- [ ] Has run at least 5 test member checkins

---

## 5. Member Onboarding Flow (Blocking)

- [ ] Member onboarding flow live in pro mobile app (per integration plan WS5.1)
- [ ] Member onboarding flow tested with at least 3 founding pros end-to-end (badge enrollment, lounge orientation, parts catalog walkthrough, training calendar subscription, first transaction)
- [ ] Average onboarding completion time <15 min verified
- [ ] First-90-day free Hub access (per integration spec section 5) configured for all new members
- [ ] Tiered-bundle pricing (per integration spec section 5) deferred to Phase 2 onward (Hub #1 launches with all members free for first 90 days)

---

## 6. Sherpa Materials Hub-Side Integration (Blocking)

End-to-end test order from Marketplace through Hub through dispatch to job site.

- [ ] **Test scenario:** Create a mock job in Marketplace within Hub #1 catchment (45-min drive radius)
- [ ] **Test step 1:** Wiseman Materials engine generates materials list and routes per decision tree (per integration spec section 8)
- [ ] **Test step 2:** Routing returns "hub_staged" for at least one line item; Zinc API ships to Hub address
- [ ] **Test step 3:** Hub Manager confirms inbound delivery, scans pallet manifest, reconciles against `hub_materials_staging.expected_at`
- [ ] **Test step 4:** Hub Manager builds job-labeled rack with printed label (job ID, pro name, dispatch wave, dispatch method)
- [ ] **Test step 5:** Inventory system updates `hub_materials_staging.staged_at`
- [ ] **Test step 6:** Wave dispatch fires Uber Direct API at scheduled time; Uber Direct driver picks up; QR scan logs `dispatched_at`
- [ ] **Test step 7:** Pro confirms receipt at job site; system writes `delivered_at`
- [ ] **Test step 8:** Margin to Hub recorded in `margin_to_hub_cents`
- [ ] **Test alternate flow:** Pro pickup option tested - pro arrives at Hub, scans member badge, system surfaces staged materials, pro takes materials, system writes `dispatched_at` with `dispatch_method = 'pro_pickup'`

---

## 7. Marketing Assets (Blocking for grand-open)

### Web + social
- [ ] Hub-page on website live with location, hours, member benefits, training calendar
- [ ] Social media announcement scheduled (LinkedIn, Instagram, Twitter/X)
- [ ] Member welcome packet printed + branded (badge enrollment QR + Hub map + Q1 training calendar + welcome letter from Phyrom)

### Press + community
- [ ] NHHBA press release drafted + ready to distribute on grand-open day
- [ ] Local trade press outreach (NH Business Review, Manchester Ink Link, Eagle-Tribune) - press kit + interview availability windows
- [ ] Email blast to Sherpa Pros database (founding pros + waitlist) drafted + scheduled
- [ ] Grand-open RSVP page live + tracking confirmations
- [ ] Sponsor manufacturers (Festool, Hilti, FW Webb) confirmed for on-site presence + display equipment

### Signage
- [ ] Exterior primary sign installed + illuminated
- [ ] Building-mounted secondary signs installed
- [ ] Wayfinding signs installed (parking, dock, member parking)
- [ ] Interior zone signs installed (Pickup / Tool Rental / Training / Lounge / Restroom)
- [ ] Tool cage + buffer stock "Staff Only" signs installed
- [ ] Branded wall graphics installed (member-lounge feature wall + brand identity)

---

## 8. Backup + Recovery Plan (Blocking)

### Data backup
- [ ] Daily automated database backup (existing platform infrastructure - confirm Hub-related tables included)
- [ ] Off-site backup retention 30+ days
- [ ] Restore procedure tested at least once

### POS / inventory backup
- [ ] If POS terminal fails: manual ticket + reconciliation procedure documented
- [ ] If internet outage: cellular backup hotspot for POS card processing + inventory query
- [ ] If power outage: UPS holds POS + NVR + router for 30+ minutes; 4-hour business interruption plan

### Member access backup
- [ ] If badge reader fails: manual entry log + Hub Manager approval procedure
- [ ] If keypad fails: backup key control + Hub Manager admin override
- [ ] After-hours emergency access procedure documented

---

## 9. Emergency Procedures (Blocking)

### Fire
- [ ] Fire extinguishers in place per fire department spec + inspected
- [ ] Exit signage illuminated + tested
- [ ] Fire evacuation route posted at member entry, lounge, training room
- [ ] Hub Manager + Hub Associate trained on fire procedure
- [ ] Quarterly fire drill scheduled (first drill within 30 days of grand-open)

### Security incident
- [ ] Incident escalation tree documented (Hub Manager -> Phyrom -> law enforcement)
- [ ] After-hours alarm triggers central monitoring -> Hub Manager mobile alert -> Phyrom escalation if no response
- [ ] Quarterly theft-response drill scheduled

### Medical
- [ ] First-aid kit stocked + locations marked
- [ ] AED installed (recommended for occupancy load + training room) + locations marked
- [ ] Hub Manager + Hub Associate certified in basic first aid + CPR (defer to first 30 days post-grand-open if not pre-grand-open)
- [ ] 911 + nearest hospital info posted (Atkinson NH - Parkland Medical Center Derry NH or Holy Family Hospital Methuen MA)

### Weather (NH winter focus)
- [ ] Snow removal contract in place for Hub-dedicated parking area
- [ ] Roof snow load monitoring procedure (NH building code - flag if accumulation exceeds threshold)
- [ ] Power outage procedure (UPS for critical, generator-ready hookup for extended outage)
- [ ] Heat-loss procedure: warehouse zone monitored to maintain 55F minimum (inventory freeze protection per `01-real-estate-confirmation.md` section 3)

---

## 10. Permits + Compliance (Blocking)

- [ ] Certificate of Occupancy issued by Town of Atkinson (per `04-permit-checklist-nh.md`)
- [ ] All permits closed out (no open inspections)
- [ ] Insurance Certificate filed
- [ ] Workers comp coverage filed with NH Department of Labor
- [ ] Business license / DBA filed with Town of Atkinson if separate from HJD Builders LLC umbrella

---

## 11. Final Walk-Through (Blocking, T-7 days)

Phyrom + Hub Manager walk every system one final time:

- [ ] Member entry: badge in, keypad in, walk member journey to lounge / counter / training room
- [ ] Receiving dock: trace inbound delivery path through staging racks
- [ ] Tool cage: rental check-out + check-in mock workflow
- [ ] POS counter: 3 mock transactions (kit pickup, parts pickup, member account charge)
- [ ] Camera coverage: review every angle from Hub Manager mobile dashboard
- [ ] Restroom + ADA accessibility verified
- [ ] Member lounge: coffee station, Wi-Fi, seating, lockers all functional
- [ ] Training room: A/V, demo bench, seating, white board ready for first event
- [ ] Exterior signage illumination verified at dusk
- [ ] Parking allocation correct + signage accurate

---

## 12. Sign-off

**All blocking items checked.**

- [ ] Phyrom signature (Founder)
- [ ] Hub Manager signature
- [ ] Date signed
- [ ] Date of grand-open

**Advisory exceptions documented (if any):**

```
Item:
Reason for exception:
Resolution plan:
Resolution target date:
```

---

**Once this checklist is complete, Hub #1 is cleared for grand-open per `09-soft-open-and-grand-open-calendar.md`.**
