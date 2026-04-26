# Sherpa Hub Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up Hub #1 (Atkinson NH at HJD HQ) as a fully operational Sherpa Pros Hub — including Sherpa Materials integration as the last-mile staging warehouse — and lay the FW Webb partnership, software, operational, and data telemetry groundwork that lets Hub #2 open within 90 days of Hub #1 grand-open.

**Architecture:** Six parallel workstreams (WS1-WS6) executed concurrently by Phyrom + Hub Manager (hired in WS1) + Upwork US contractors + Claude sub-agents. Critical-path dependencies: Hub Manager hire (gates everything operational), POS/inventory system selection (gates IT install), FW Webb LOI (gates Hub #2 economics), Sherpa Materials top-50 SKU list (gates inventory order).

**Source spec:** `docs/superpowers/specs/2026-04-25-sherpa-hub-integration-design.md`

**Owners:**
- **P** = Phyrom
- **HM** = Hub Manager #1 (hired in WS1, on-floor by Phase 1 Month 5)
- **CON** = Upwork US contractor (operations / vendor sourcing)
- **AI** = Claude sub-agent

---

## Workstream 1 — Hub #1 Atkinson NH Buildout

**Goal:** Convert HJD HQ underutilized warehouse bay into Hub #1, hire team, soft-open by end of Month 5, grand-open by end of Month 6.

### Task WS1.1: Confirm Hub #1 real estate at HJD HQ

**Owner:** P
**Files:** Create `docs/operations/hub-1-real-estate.md`
**Deliverable:** One-page real estate confirmation with floor plan sketch, square footage measured, dock-door access confirmed, electrical service confirmed, parking allocation confirmed.
**Acceptance:** Document signed off by Phyrom; floor plan sketch attached (hand-drawn OK).
**Dependencies:** none

- [ ] Walk the HJD HQ warehouse bay and measure exact square footage available
- [ ] Confirm at least one usable dock door and access path
- [ ] Confirm 200A electrical service available with at least 6 dedicated 20A circuits
- [ ] Confirm parking allocation (4 staff + 12 member spots minimum)
- [ ] Sketch floor plan: warehouse / showroom / training / receiving zones
- [ ] Save as `docs/operations/hub-1-real-estate.md`

### Task WS1.2: Hub #1 fit-out plan + cost estimate

**Owner:** P + CON
**Files:** Create `docs/operations/hub-1-fitout-plan.md`
**Deliverable:** Detailed fit-out plan with line-item cost estimate, target ~$60K total per spec §9.
**Acceptance:** Plan covers flooring, lighting, HVAC zoning, signage, security camera infrastructure, racking, POS counter, training-room layout, member lounge.
**Dependencies:** WS1.1

- [ ] List every fit-out trade needed (flooring, electrical, signage, security, racking install)
- [ ] Solicit 3 quotes per trade from local subs
- [ ] Build line-item cost estimate
- [ ] Build 8-week fit-out timeline
- [ ] Save as `docs/operations/hub-1-fitout-plan.md`

### Task WS1.3: Equipment manifest for Hub #1

**Owner:** P + CON
**Files:** Create `docs/operations/hub-1-equipment-manifest.md`
**Deliverable:** Complete equipment list — POS hardware, security cameras, network gear, racks, forklift/pallet jack, materials staging carts, kit assembly bench tools.
**Acceptance:** Every line has SKU, supplier, qty, unit cost, total cost, lead time. Total tracks against §9 capex budget.
**Dependencies:** WS1.1

- [ ] POS hardware (counter terminal, mobile barcode scanners, receipt printer, cash drawer if any)
- [ ] Security cameras (8-camera IP system per spec §6) + NVR + cloud subscription
- [ ] Network: business-grade router, AP coverage, hardwired POS line
- [ ] Industrial racking (warehouse + tool cage)
- [ ] Pallet jack + 2 staging carts + 1 dock plate
- [ ] POS counter + display kiosks
- [ ] Training-room: 12 chairs, projector, demo benches
- [ ] Save as `docs/operations/hub-1-equipment-manifest.md`

### Task WS1.4: Opening inventory list (top-50 SKUs Phase 1)

**Owner:** P + AI (Wiseman Materials engine query)
**Files:** Create `docs/operations/hub-1-opening-inventory.md`
**Deliverable:** Top-50 SKU buffer-stock list for Phase 1 Hub #1 launch + opening kit inventory for the 10 kit categories from April 15 spec.
**Acceptance:** Each SKU has supplier, unit cost, opening qty, reorder point, reorder qty. Total opening inventory budget tracks ~$25K per spec §9.
**Dependencies:** none (can run parallel)

- [ ] Query Wiseman Materials engine for highest-frequency SKUs across known job patterns (NH/MA/ME plumbing/electrical/finish)
- [ ] Sort top 50 by predicted volume × margin
- [ ] Confirm supplier (FW Webb / Grainger / Home Depot Pro / direct)
- [ ] Set opening qty + reorder point + reorder qty per SKU
- [ ] Add 10 kit category opening inventory (5 of each kit pre-assembled)
- [ ] Save as `docs/operations/hub-1-opening-inventory.md`

### Task WS1.5: Job description + recruiting brief for Hub Manager #1

**Owner:** P
**Files:** Create `docs/operations/hub-manager-job-description.md` and `docs/operations/hub-manager-recruiting-brief.md`
**Deliverable:** Polished JD ready to post + recruiting brief explaining target candidate profile (FW Webb branch managers, Lowe's Pro Desk managers, Home Depot Pro Desk managers, supply house counter managers).
**Acceptance:** JD includes salary range, bonus structure (per spec §6), responsibilities, requirements. Recruiting brief lists 12 specific target companies in NH/MA/ME with contact strategies.
**Dependencies:** none

- [ ] Draft JD with salary range $58-72K + bonus structure
- [ ] List target companies (FW Webb branches, Lowe's Pro Desk, HD Pro Desk, McMaster-Carr, supply houses)
- [ ] Identify 5 specific candidates by LinkedIn search
- [ ] Save both files

### Task WS1.6: Source Hub Manager candidates

**Owner:** P + CON
**Files:** none
**Deliverable:** 12+ candidates in pipeline by end of Phase 1 Month 3.
**Acceptance:** 5 first-round phone screens completed.
**Dependencies:** WS1.5

- [ ] Post JD on LinkedIn, Indeed, NH/MA construction job boards
- [ ] Direct outreach to 12 target candidates from recruiting brief
- [ ] Phone screen first 5 within 2 weeks
- [ ] Schedule on-site interviews for top 3

### Task WS1.7: Hire Hub Manager #1

**Owner:** P
**Files:** none
**Deliverable:** Signed offer letter, start date Phase 1 Month 5.
**Acceptance:** Hired candidate has 5+ years pro-counter or branch-management experience.
**Dependencies:** WS1.6

- [ ] On-site interview top 3 candidates
- [ ] Reference check finalist (3 references)
- [ ] Make offer
- [ ] Onboard on Day 1: badge, accounts, payroll, IT, walkthrough

### Task WS1.8: Hire Hub Associate(s)

**Owner:** HM (with P oversight)
**Files:** none
**Deliverable:** 1 PT Hub Associate hired by Phase 1 Month 5.
**Acceptance:** Hired before soft-open.
**Dependencies:** WS1.7

- [ ] HM drafts Associate JD adapted from manager template
- [ ] Source via Indeed + local trade-school job boards
- [ ] Interview, hire, onboard

### Task WS1.9: Soft-open Hub #1

**Owner:** HM + P
**Files:** Create `docs/operations/hub-1-soft-open-checklist.md`
**Deliverable:** Hub operational with limited member access (Founding Pros only) for 30 days before grand-open.
**Acceptance:** All systems live, 5+ Founding Pros checked in, no critical incidents.
**Dependencies:** WS1.1-WS1.8 + WS3 IT install + WS4 playbook

- [ ] Walk-through with Phyrom checking every system
- [ ] Invite 10 Founding Pros to soft-open week
- [ ] Run 30-day controlled-access soft-open
- [ ] Capture punch list of fixes
- [ ] Save soft-open checklist + outcomes

### Task WS1.10: Grand-open Hub #1

**Owner:** P + HM
**Files:** none
**Deliverable:** Public Hub #1 grand-open event end of Phase 1 Month 6.
**Acceptance:** 30+ pros attend, local trade press covers, NPS responses captured from attendees.
**Dependencies:** WS1.9

- [ ] Schedule grand-open date
- [ ] Marketing push (NH home builders' association, local trade press, social)
- [ ] Hire caterer + sponsor swag
- [ ] Run event
- [ ] Capture NPS + member-signup rate

---

## Workstream 2 — FW Webb Partnership Development

**Goal:** Sign FW Webb 5-Hub pilot LOI by Phase 1 Month 4 (hard deadline per spec §4).

### Task WS2.1: Build FW Webb target contact list

**Owner:** P
**Files:** Create `docs/partnerships/fw-webb-contacts.md`
**Deliverable:** Named list of FW Webb decision-makers — Branch President, VP Strategy, regional ops directors for NH/MA/ME branches.
**Acceptance:** 8+ named contacts with role, location, intro path.
**Dependencies:** none

- [ ] LinkedIn research FW Webb leadership team
- [ ] Identify warm-intro paths (NHHBA, supply network mutuals)
- [ ] Save contact list

### Task WS2.2: Draft FW Webb intro deck

**Owner:** P + CON
**Files:** Create `docs/partnerships/fw-webb-intro-deck.md` (markdown source for Keynote/Slides export)
**Deliverable:** 12-15 slide deck pitching the partnership: what Sherpa is, what we want from FW Webb, what FW Webb gets in return.
**Acceptance:** Deck approved by Phyrom; ready for first warm intro meeting.
**Dependencies:** WS2.1

- [ ] Slide 1-3: Sherpa Pros overview + traction
- [ ] Slide 4-6: Hub model + the materials orchestration thesis
- [ ] Slide 7-9: Why FW Webb is the ideal partner (foot-traffic uplift, anonymized usage data, brand halo)
- [ ] Slide 10-12: The proposed pilot (5 Hubs, terms, timeline)
- [ ] Slide 13-15: Ask + next steps
- [ ] Save deck markdown

### Task WS2.3: First FW Webb meeting

**Owner:** P
**Files:** none
**Deliverable:** First in-person meeting with FW Webb decision-maker by Phase 1 Month 2.
**Acceptance:** Meeting happened; follow-up scheduled.
**Dependencies:** WS2.1, WS2.2

- [ ] Send warm-intro emails
- [ ] Schedule meeting
- [ ] Run meeting (deck walk + Q&A)
- [ ] Capture meeting notes
- [ ] Send same-day follow-up

### Task WS2.4: Draft FW Webb pilot LOI

**Owner:** P (with legal review)
**Files:** Create `docs/partnerships/fw-webb-pilot-loi-draft.md`
**Deliverable:** Draft LOI structuring the 5-Hub pilot.
**Acceptance:** Includes co-location terms, sub-lease pricing, Sherpa pro discount card honoring FW Webb pricing, default-supplier mechanic with override, term length, partnership performance review framework.
**Dependencies:** WS2.3

- [ ] Pilot Hubs: 5 locations, mutually selected, NH/MA/ME priority
- [ ] Sub-lease: 1,500-2,000 sqft carve-out per branch, ~$1.5K/month rent
- [ ] Sherpa Materials default supplier: FW Webb-stocked SKUs default to FW Webb
- [ ] Discount card: FW Webb in-branch pricing honored for Sherpa pros
- [ ] Term: 24-month pilot, 90-day mutual-out clause
- [ ] Performance review: quarterly, structured metrics
- [ ] Save LOI draft

### Task WS2.5: Negotiate + sign FW Webb pilot LOI

**Owner:** P
**Files:** none
**Deliverable:** Signed LOI by Phase 1 Month 4 (hard deadline).
**Acceptance:** Signed by both parties.
**Dependencies:** WS2.4

- [ ] Negotiate redlines
- [ ] Legal final review (Sherpa attorney)
- [ ] Sign
- [ ] If not signed by deadline: trigger fallback (default Hubs #2-#3 to standalone) per spec §4

### Task WS2.6: Partnership performance review framework

**Owner:** P + HM
**Files:** Create `docs/partnerships/fw-webb-performance-review-framework.md`
**Deliverable:** Quarterly review template covering Sherpa pro foot traffic to FW Webb branches, FW Webb default-supplier order volume, Hub member NPS at co-located vs standalone Hubs, partnership health.
**Acceptance:** Template ready for first QBR after Hub #2 opens.
**Dependencies:** WS2.5

- [ ] Define 8 quarterly metrics
- [ ] Build template
- [ ] Save

---

## Workstream 3 — Sherpa Materials Integration (Software + Operations)

**Goal:** Hub #1 fully integrated as a Sherpa Materials staging node by soft-open. Zinc API ships to Hub, Uber Direct dispatches from Hub, top-50 SKUs in buffer stock.

### Task WS3.1: POS / inventory system selection

**Owner:** P + AI
**Files:** Create `docs/operations/pos-system-decision.md`
**Deliverable:** Decision document: build on existing Drizzle/Postgres stack vs. integrate retail POS (Square for Retail / Lightspeed Retail).
**Acceptance:** Clear recommendation per spec §14 Open Decision #6 (recommendation: build on existing stack for Phase 1-2). Locked Phase 1 Month 2.
**Dependencies:** none

- [ ] Analyze build vs. buy
- [ ] Document tradeoffs
- [ ] Lock decision
- [ ] Save document

### Task WS3.2: Apply database migration for new Hub tables

**Owner:** AI
**Files:** Create `src/db/migrations/011_hub_integration_tables.sql`
**Deliverable:** Migration creating `hub_materials_staging`, `hub_access_log`, `hub_metrics_daily` tables (per spec §7).
**Acceptance:** Migration runs cleanly on local + Neon staging.
**Dependencies:** WS3.1

- [ ] Copy SQL from spec §7
- [ ] Add indexes per spec
- [ ] Test on local Postgres
- [ ] Apply to Neon staging
- [ ] Save migration file

### Task WS3.3: Update Drizzle schema with new Hub tables

**Owner:** AI
**Files:** Modify `src/db/drizzle-schema.ts`
**Deliverable:** Drizzle table definitions matching new SQL tables.
**Acceptance:** TypeScript types compile; tables queryable from Drizzle.
**Dependencies:** WS3.2

- [ ] Add `hubMaterialsStaging`, `hubAccessLog`, `hubMetricsDaily` tables
- [ ] Run `npm run build`

### Task WS3.4: Hub Manager dashboard API endpoint

**Owner:** AI
**Files:** Create `src/app/api/hub/dashboard/[hubId]/today/route.ts`
**Deliverable:** GET endpoint returning today's staging schedule, low-stock items, active rentals.
**Acceptance:** Returns JSON shape per spec §7 example query; tests pass.
**Dependencies:** WS3.3

- [ ] Implement query
- [ ] Add unit test
- [ ] Verify with seed data

### Task WS3.5: Wiseman Materials engine routing — Hub-aware

**Owner:** AI
**Files:** Modify `src/lib/wiseman-bridge/materials-routing.ts` (create if missing)
**Deliverable:** Routing function implements decision tree from spec §8.
**Acceptance:** Given a job + materials list + Hub list, returns route per line (`hub_buffer` / `hub_staged` / `supplier_direct`).
**Dependencies:** WS3.3

- [ ] Implement decision tree per spec §8
- [ ] Add geographic catchment helper (45-min drive from Hub)
- [ ] Add unit tests covering all 4 branches

### Task WS3.6: Zinc API ship-to-Hub configuration

**Owner:** AI
**Files:** Modify `src/lib/materials/zinc-client.ts`
**Deliverable:** When routing returns `hub_staged`, Zinc order ships to Hub address.
**Acceptance:** Integration test confirms shipping_address overridden to Hub.
**Dependencies:** WS3.5

- [ ] Add `shipTo` parameter
- [ ] Wire Hub address lookup
- [ ] Test with mock Zinc client

### Task WS3.7: Uber Direct dispatch-from-Hub configuration

**Owner:** AI
**Files:** Modify `src/lib/materials/uber-direct-client.ts`
**Deliverable:** Wave-batched dispatch from Hub address (6:30 / 8:00 / 10:00 / 12:00).
**Acceptance:** Cron job groups same-wave staging records and triggers single Uber Direct call per wave.
**Dependencies:** WS3.5

- [ ] Implement wave grouping
- [ ] Add cron handler
- [ ] Unit test

### Task WS3.8: Top-50 SKU buffer-stock list lock for Hub #1

**Owner:** P + AI
**Files:** Create `docs/operations/hub-1-top50-skus.md`
**Deliverable:** Locked top-50 list with reorder thresholds.
**Acceptance:** Phyrom signs off; matches WS1.4 opening inventory.
**Dependencies:** WS1.4, WS3.5

- [ ] Cross-check WS1.4 list against routing decision tree
- [ ] Confirm 50 SKUs make sense for NH/MA/ME job mix
- [ ] Save list

### Task WS3.9: Pro mobile app — Hub features

**Owner:** AI
**Files:** Modify `src/app/(dashboard)/pro/hub/page.tsx` (create)
**Deliverable:** Pro app shows nearest Hub, hours, parts in stock, training calendar, "pickup at Hub" toggle for active jobs.
**Acceptance:** Mobile-first; loads in <1.5s.
**Dependencies:** WS3.3

- [ ] Build page (server component default per CLAUDE.md)
- [ ] Add live inventory query
- [ ] Add training calendar embed
- [ ] Add pickup toggle wired to staging table
- [ ] Mobile-first styling per DESIGN.md

---

## Workstream 4 — Hub Operational Playbook

**Goal:** Hub Manager #1 has a complete playbook day one. Daily/weekly/monthly runbook documented. Security playbook documented. Insurance bound.

### Task WS4.1: Hub Manager training curriculum

**Owner:** P
**Files:** Create `docs/operations/hub-manager-training-curriculum.md`
**Deliverable:** 2-week onboarding curriculum for Hub Manager #1.
**Acceptance:** Covers Sherpa Pros platform, Hub operations, materials integration, member acquisition, P&L ownership.
**Dependencies:** none

- [ ] Week 1: platform + product, ride-along with Phyrom on member calls
- [ ] Week 2: Hub operations (POS, inventory, returns, staging, dispatch), security, P&L
- [ ] Save curriculum

### Task WS4.2: Hub Associate training playbook

**Owner:** HM (drafted by P)
**Files:** Create `docs/operations/hub-associate-training-playbook.md`
**Deliverable:** 5-day onboarding curriculum for Associates.
**Acceptance:** Covers POS basics, kit assembly, rental check-in/out, member greet protocol.
**Dependencies:** WS4.1

- [ ] Day 1: orientation + POS
- [ ] Day 2: kit assembly + warehouse layout
- [ ] Day 3: rental flow + tool cage
- [ ] Day 4: member services + lounge
- [ ] Day 5: shadowing
- [ ] Save

### Task WS4.3: Daily / weekly / monthly runbook

**Owner:** P + HM
**Files:** Create `docs/operations/hub-runbook.md`
**Deliverable:** Single document codifying spec §6 daily/weekly/monthly cadence.
**Acceptance:** Hub Manager can execute the runbook standalone.
**Dependencies:** none

- [ ] Daily ops timeline (5am-6pm)
- [ ] Weekly cadence (Mon inventory, Wed returns, Fri reconciliation)
- [ ] Monthly cadence (P&L review, NPS survey, capex review)
- [ ] Save

### Task WS4.4: Security playbook

**Owner:** P + CON
**Files:** Create `docs/operations/hub-security-playbook.md`
**Deliverable:** Security operations document — access control, surveillance, high-value cage, cash handling, incident response.
**Acceptance:** Quarterly drill schedule included.
**Dependencies:** none

- [ ] Document per spec §6 security playbook
- [ ] Add escalation tree
- [ ] Add quarterly drill schedule
- [ ] Save

### Task WS4.5: Insurance broker engagement + bind policy

**Owner:** P
**Files:** Create `docs/operations/hub-insurance-policy-summary.md`
**Deliverable:** Bound insurance policy per spec §6 coverage matrix.
**Acceptance:** Master policy with per-Hub schedule structure; ~$3,550/year for Hub #1.
**Dependencies:** WS1.1

- [ ] Engage broker (target: The Hartford or Chubb)
- [ ] Submit application with Hub #1 details
- [ ] Bind policy
- [ ] Save policy summary

### Task WS4.6: POS + inventory system go-live

**Owner:** AI + HM
**Files:** none
**Deliverable:** POS + inventory live on opening day.
**Acceptance:** Test transactions complete end-to-end; inventory queries fast.
**Dependencies:** WS3.1, WS3.2, WS3.3, WS1.3

- [ ] Install POS terminal
- [ ] Provision staff accounts
- [ ] Load opening inventory
- [ ] Run test transactions
- [ ] Document any blockers

---

## Workstream 5 — Hub Member Acquisition + Retention

**Goal:** 60+ active members by end of Phase 1 Month 6. NPS measurement live. Referral program live.

### Task WS5.1: Member onboarding flow

**Owner:** AI
**Files:** Modify `src/app/(dashboard)/pro/hub/onboarding/page.tsx` (create)
**Deliverable:** First-visit member onboarding: badge issuance, lounge orientation, parts catalog walk-through, training calendar subscription.
**Acceptance:** New member completes onboarding in <15 min.
**Dependencies:** WS3.3

- [ ] Build flow page
- [ ] Wire badge issuance to access table
- [ ] Capture member-profile additions
- [ ] Test on Founding Pro

### Task WS5.2: Q1 training event calendar

**Owner:** P + HM
**Files:** Create `docs/operations/hub-1-q1-training-calendar.md`
**Deliverable:** Confirmed Q1 training events with manufacturer sponsors per April 15 spec annual rotation.
**Acceptance:** 6 events confirmed (2/month), sponsor commitments secured.
**Dependencies:** WS1.7

- [ ] Confirm Jan/Feb/Mar slots from April 15 spec
- [ ] Reach out to manufacturer sponsors (Festool, Hilti, OSHA partner, Schluter, Milwaukee, EPA RRP)
- [ ] Lock dates
- [ ] Save calendar

### Task WS5.3: NPS survey cadence + database

**Owner:** AI
**Files:** Create `src/db/migrations/012_hub_nps_responses.sql` and `src/app/api/hub/nps/route.ts`
**Deliverable:** Monthly SMS-based NPS survey, responses stored in `hub_nps_responses` table.
**Acceptance:** Cron triggers on 15th of each month; responses logged.
**Dependencies:** WS3.2

- [ ] Add `hub_nps_responses` table (10 questions, 90-second target)
- [ ] Wire SMS via Twilio
- [ ] Add cron handler
- [ ] Test

### Task WS5.4: Member referral program

**Owner:** AI + P
**Files:** Modify `src/lib/incentives/referral.ts` (create if missing)
**Deliverable:** Pro-to-pro referral: refer 3, get 30 days free Hub upgrade.
**Acceptance:** Referral codes trackable per pro; payouts auto-applied.
**Dependencies:** WS3.3

- [ ] Implement referral code logic
- [ ] Wire to Hub subscription
- [ ] Add UI in pro app
- [ ] Test

### Task WS5.5: Member newsletter template

**Owner:** CON + HM
**Files:** Create `docs/operations/hub-member-newsletter-template.md`
**Deliverable:** Weekly Friday newsletter template — what's new at Hub, training events, supplier promos, member spotlights.
**Acceptance:** First issue mailed during soft-open week.
**Dependencies:** WS1.9

- [ ] Build template
- [ ] Define content sections
- [ ] First issue draft
- [ ] Save template

---

## Workstream 6 — Hub Data Telemetry Implementation

**Goal:** Per-Hub P&L dashboard live. Network-wide ops dashboard live. Franchise-ready reporting view exists per franchise spec requirement.

### Task WS6.1: Daily denormalized snapshot job

**Owner:** AI
**Files:** Create `src/lib/jobs/hub-metrics-snapshot.ts` and `src/app/api/cron/hub-metrics-snapshot/route.ts`
**Deliverable:** 1am cron writes prior day metrics to `hub_metrics_daily` per spec §7.
**Acceptance:** Snapshot job runs successfully; rows appear daily.
**Dependencies:** WS3.2, WS3.3

- [ ] Implement aggregation queries
- [ ] Wire as Vercel cron at 1am
- [ ] Test
- [ ] Verify rows for Hub #1

### Task WS6.2: Per-Hub P&L dashboard view

**Owner:** AI
**Files:** Create `src/app/(dashboard)/hub-manager/p-and-l/page.tsx`
**Deliverable:** Live P&L dashboard scoped to the Hub Manager's Hub.
**Acceptance:** Loads in <1s; shows month-to-date revenue (member fees, materials margin, rentals, training, adjacent), opex, net.
**Dependencies:** WS6.1

- [ ] Build page
- [ ] Wire to `hub_metrics_daily`
- [ ] Add charts (Tremor or recharts)
- [ ] RBAC: Hub Manager + HQ-only

### Task WS6.3: Network-wide ops dashboard for HQ

**Owner:** AI
**Files:** Create `src/app/(dashboard)/hq/hubs/page.tsx`
**Deliverable:** HQ Operations dashboard — all-Hubs roll-up per spec §12.
**Acceptance:** Shows operational vs. in-buildout vs. in-pipeline Hubs, network-wide member trend, materials throughput, Hub Manager performance ranking, capex deployment.
**Dependencies:** WS6.1

- [ ] Build page
- [ ] Wire roll-up queries
- [ ] Add filters (region, ownership type)
- [ ] RBAC: HQ-only

### Task WS6.4: Franchise-ready reporting view

**Owner:** AI
**Files:** Create `src/app/(dashboard)/franchisee/[hubId]/p-and-l/page.tsx`
**Deliverable:** Franchisee-scoped P&L view satisfying franchise spec FDD Item 19 disclosure shape.
**Acceptance:** Same data structure as WS6.2 but scoped to a franchisee's Hub(s); ready when first franchisee onboards.
**Dependencies:** WS6.2

- [ ] Build page
- [ ] Reuse WS6.2 components
- [ ] Add franchisee RBAC scope
- [ ] Add export-to-PDF for FDD compliance

### Task WS6.5: Weekly Hub Manager publishing flow

**Owner:** AI + HM
**Files:** Modify `src/app/(dashboard)/hub-manager/weekly-report/page.tsx` (create)
**Deliverable:** Hub Manager publishes weekly report to HQ every Friday by 5pm.
**Acceptance:** Auto-pre-fills from `hub_metrics_daily`; HM adds qualitative narrative; one-click publish.
**Dependencies:** WS6.1

- [ ] Build page
- [ ] Pre-fill quantitative fields
- [ ] Add narrative fields (community signal, incidents, planned changes)
- [ ] Wire publish action (writes to `hub_weekly_reports` table — add to migration WS6.6)

### Task WS6.6: Hub weekly reports schema + audit log integration

**Owner:** AI
**Files:** Create `src/db/migrations/013_hub_weekly_reports.sql`
**Deliverable:** `hub_weekly_reports` table; integrate with Sherpa Guard audit log per spec §7.
**Acceptance:** Migration runs; weekly publish event lands in audit_logs.
**Dependencies:** WS6.5

- [ ] Add table
- [ ] Wire audit log hook
- [ ] Test

---

## Critical-path summary

| Milestone | Target | Gating |
|---|---|---|
| Hub Manager #1 hired | Phase 1 Month 4 offer, Month 5 start | WS1.5-WS1.7 |
| FW Webb LOI signed | Phase 1 Month 4 (hard deadline) | WS2.1-WS2.5 |
| POS + inventory live | Phase 1 Month 5 | WS3.1, WS3.2, WS3.3, WS4.6 |
| Sherpa Materials Hub-aware routing | Phase 1 Month 5 | WS3.5-WS3.7 |
| Hub #1 soft-open | Phase 1 Month 5 | WS1.9 |
| Hub #1 grand-open | Phase 1 Month 6 | WS1.10 |
| Telemetry dashboards live | Phase 1 Month 5 | WS6.1, WS6.2, WS6.3 |

**Total tasks:** 41 across 6 workstreams.

---

**End of Sherpa Hub Integration plan.**
