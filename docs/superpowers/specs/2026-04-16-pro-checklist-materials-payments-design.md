# Pro Checklist + Materials + Payments — Design Spec

## Overview

End-to-end system for job execution: Wiseman generates project scope, process, checklist, and materials list. Pro reviews and adjusts (Wiseman validates changes). SerpApi provides real-time Home Depot pricing. Client approves and funds via card hold (Stripe) or financing (Wisetack). Zinc API places the Home Depot order. 4-tier delivery routes materials to the job site. Change orders handled via threshold-based auto-approval. Completion triggers payment capture and pro payout.

## Roles

### Sherpa Success Pro (SSP) — Pro-side
- **AI agent** powered by Wisemen, backed by human contractor (Upwork)
- Manages pro's projects, reviews change orders, handles materials logistics
- AI handles: checklist monitoring, materials review, scheduling, notifications
- Human handles: phone calls, relationship management, complex disputes
- Every pro gets an SSP

### Sherpa Client Pro (SCP) — Client-side
- **AI agent** powered by Wisemen, backed by human contractor (Upwork)
- Manages client experience, explains costs, handles approvals
- AI handles: cost breakdowns, approval notifications, progress updates, financing guidance
- Human handles: personal check-ins, dispute resolution, judgment calls
- Only for clients subscribed to **Sherpa Plan**. Non-subscribers get AI-only support.

## Phase 1: Checklist Generation

When a job is accepted (bid selected), the Wiseman system auto-generates a complete job package:

### Scope Document
- Generated from job description + category + Code Wiseman compliance data
- Includes: project requirements, code references (IRC/IBC), permit requirements
- Sourced from: Code Wiseman + Architect Wiseman

### Working Process / Installation Recommendations
- Step-by-step suggested work order
- Safety notes per phase (OSHA mapped)
- Estimated time per task
- Sourced from: Checklist Wiseman templates (35+ templates, 12 phases)

### Project Checklist
- Phase-by-phase inspection checklist
- Quality gates between phases (e.g., pre-drywall verification)
- Photo documentation requirements per task
- OSHA compliance checkpoints
- Sourced from: Checklist Wiseman + Assembly Wiseman

### Materials List
- Every material, quantity, and spec needed for the job
- Auto-generated from Assembly Wiseman (913 verified assemblies) + Pricing Wiseman (237 materials)
- Items include: name, quantity, unit, spec/grade, category (lumber, plumbing, electrical, etc.)
- Each item tagged with which checklist phase it's needed for

## Phase 2: Pro Review + Wiseman Validation

The Pro reviews the Wiseman-generated materials list and can make adjustments:

### Pro Actions
- **Add items** — with required note explaining why (e.g., "Need extra caulk for shower pan")
- **Remove items** — with required note explaining why (e.g., "Client already has a faucet")
- **Adjust quantities** — up or down with note
- **Swap specs/brands** — substitute equivalent items with note

### Wiseman Review of Changes
For every Pro change, the Wiseman automatically reviews and responds:

- **Approved** — change makes sense given the job scope. No issues.
- **Warning** — Wiseman recommends an alternative or flags a concern (e.g., "Removing waterproof membrane may void warranty on tile installation"). Pro can override with acknowledgment.
- **Flagged** — safety or code compliance concern (e.g., "Removing GFCI outlet from bathroom violates NEC 210.8"). Cannot proceed without SSP review.

### SSP Monitoring
- AI SSP monitors all Pro changes in real-time
- Flags unusual patterns (removing too many items, excessive quantity increases)
- Escalates to human SSP when: flagged items, total cost change > 20%, or safety concerns

## Phase 3: Real-Time Pricing (SerpApi)

Once the materials list is finalized (Pro + Wiseman agree), SerpApi queries Home Depot for real-time pricing:

### Per Item Query
- Search by: product name + spec + quantity
- Filter by: client's zip code (nearest Home Depot store)
- Returns: current retail price, stock status (in-stock / limited / out-of-stock), nearest store with availability, product image, Home Depot SKU

### Pricing Display
- Itemized list with real prices (not estimates)
- Subtotal for materials
- Sherpa Pros fees itemized (see Fee Structure below)
- Grand total clearly displayed
- Store availability shown per item (green = in stock, amber = limited, red = unavailable)
- Unavailable items: suggest alternative store or substitute product

### Data Freshness
- Prices cached for 4 hours (Home Depot prices don't change intra-day)
- Re-query on demand if client requests refresh
- Price shown at approval time is the price locked in

## Phase 4: Client Approval + Funding

Client receives a materials cost summary and chooses how to fund:

### Option A: Card Hold (Stripe)
- Stripe PaymentIntent with `capture_method: 'manual'`
- Authorizes the full amount (materials + fees) on client's card
- Funds reserved but NOT charged
- Hold valid for 7 days (Stripe limit)
- If job extends past 7 days, re-authorize required
- Client sees "Payment authorized" status

### Option B: Wisetack Financing
- Client applies in-app via Wisetack embedded widget (white-label)
- Real-time approval decision (soft credit pull, seconds)
- Loan amount: $500 — $25,000
- APR range: 0 — 29.9% (varies by creditworthiness)
- Wisetack pays Sherpa Pros the full amount upfront
- Client repays Wisetack monthly
- Sherpa Pros earns referral kickback (~2% of loan amount)

### Pro Side: Stripe Capital
- Pro needs cash flow before job pays out
- Stripe Capital automatically offers advances to eligible Stripe Connect accounts
- Pro accepts advance, funds deposited immediately
- Repaid automatically from future Sherpa Pros payouts (factor rate 10-16%)
- Sherpa Pros does NOT set the terms — Stripe manages this entirely

### SCP Role
- AI SCP presents both options with clear cost comparison
- Explains financing terms in plain language
- If client is on Sherpa Plan, human SCP calls to walk them through
- No pressure toward either option — client chooses

## Fee Structure

### Sherpa Service Fee — Single All-In Fee (Revised per CxO/Marketing/Support Review)

One bundled fee covers everything: materials sourcing, pricing lookup, order placement, delivery coordination, Wiseman validation, SSP/SCP support, and financing integration. No separate line items — clients see ONE fee.

| Client Tier | Service Fee | Gig Delivery | Notes |
|-------------|-------------|-------------|-------|
| **Subscribed Member** | **12%** | **Included** | Loyalty perk — gig delivery at no extra charge |
| **One-Time Client** | **18%** | **Pass-through + 15%** | Standard marketplace rate |
| **Emergency** | **25%** | **Included** | Capped — no stacking beyond 25% total |

Plus: ~2% Wisetack referral kickback on all financed orders (revenue to Sherpa Pros, not charged to client).

Plus: $2.99 Delivery Protection fee on all gig deliveries — funds damage reserve for lost/broken items.

### Revenue Summary (per $2,000 materials order)

| Scenario | Client Pays | Sherpa Earns |
|----------|-------------|-------------|
| Subscribed, card hold | $2,240 | $240 + job commission |
| Subscribed, financed | $2,240 | $240 + ~$40 (Wisetack referral) + commission |
| One-time, card hold | $2,360 | $360 + commission |
| One-time, financed | $2,360 | $360 + ~$40 (Wisetack referral) + commission |
| Emergency, any funding | $2,500 | $500 + referral + commission |

These fees are IN ADDITION TO the job commission (sliding 8-15% on labor).

### Pricing Principles (from CxO/Marketing/Support review)
- **One line item** — never show separate handling/financing/delivery charges. Internally tracked, externally bundled as "Sherpa Service Fee."
- **Emergency capped at 25%** — no stacking beyond this. Protects brand from price gouging perception and NH/MA regulatory risk.
- **Frame against hidden markups** — approval screen shows: "Typical contractor markup: 15-30% (hidden). Sherpa: X% (transparent, guaranteed correct parts)."
- **Delivery damage under $500** — Sherpa eats it, no questions asked. Funded by delivery protection fee.
- **24-hour refund window** — full fee refund if client cancels before materials ship.
- **Post-emergency receipt** — auto-send timeline showing exactly what happened and when, justifying the surcharge.
- **First job free** — new subscribers get first job with no service fee (conversion trigger).
- **Legal review required** — NH/MA price gouging statutes must be reviewed before emergency tier launches.

### SLAs by Delivery Tier

| Tier | SLA | Miss = |
|------|-----|--------|
| Pro Pickup (BOPIS) | Ready in 30 min | Fee waived |
| HD Delivery | 3-5 business days | Fee waived |
| Gig Delivery | 2 hours | Fee waived |
| Emergency Dispatch | 90 minutes (Pro on-site) | Fee waived |

## Phase 5: Order Placement + Delivery (Zinc API)

Once funded, Zinc API places the Home Depot order:

### Order Flow
1. Sherpa Pros sends order to Zinc API: items (by HD SKU), quantities, delivery/pickup preference, store location
2. Zinc places the order on Home Depot (using a Sherpa Pros purchasing account)
3. Zinc returns: order confirmation, estimated ready time, tracking info
4. SSP notifies Pro: "Materials ordered — ready for pickup at [store] by [time]" or "Delivery scheduled for [date]"

### 4-Tier Delivery Routing

The Wiseman evaluates each order and recommends the optimal delivery method:

**Tier 1: Pro Pickup (BOPIS)**
- When: Pro is near a Home Depot, small-medium order
- Zinc places "Buy Online Pick Up In Store" order
- Pro receives order confirmation + aisle/bay location
- ~30 minutes to ready

**Tier 2: Home Depot Delivery**
- When: Large/heavy items (lumber, drywall, appliances), non-urgent timeline
- Zinc places delivery order to job site address
- 1-3 business days
- No Sherpa markup — HD delivery fee passed through

**Tier 3: Gig Delivery (Uber Connect / DoorDash Drive)**
- When: Emergency or time-sensitive, items fit in a car
- Zinc places BOPIS order, then Sherpa Pros dispatches a gig driver to pick up
- Wiseman size/weight check determines eligibility:
  - Eligible: < 50 lbs total, < 10 items, no items > 4ft long
  - Not eligible: lumber, drywall, appliances, bulk bags (cement, gravel)
- 1-2 hours
- 20% markup on gig delivery cost

**Tier 4: Pro's Choice**
- When: Non-urgent, Pro prefers to decide
- Pro sees all available options with time/cost comparison
- Selects preferred method

### Delivery Tracking
- All orders tracked in-app (order status, driver location for gig delivery)
- Client and Pro both see real-time status
- SSP monitors and escalates if delivery issues arise

## Phase 6: Work In Progress + Change Orders

### Checklist Progress
- Pro checks off tasks as completed in the app
- Photo required per completed task (uploaded, timestamped, geotagged)
- Progress bar visible to: Pro, Client, SSP, SCP
- SSP monitors pace — flags if behind schedule

### Change Orders (Additional Materials)
When a Pro needs materials not on the original list:

**Auto-Approved (< 10% of original materials budget):**
- Pro adds items in-app with notes
- Wiseman reviews for safety/code compliance
- If approved: SerpApi prices, Zinc orders, delivery dispatched
- Client notified after the fact: "Additional materials ordered: [items] — $[amount]"
- Charged to existing card hold or Wisetack loan (incremental capture)

**Client Approval Required (> 10% of budget):**
- Pro adds items with notes explaining why
- Wiseman reviews and provides recommendation
- SCP presents to client: itemized additions, reason, Wiseman recommendation
- Client approves or discusses with SCP
- Once approved: pricing → ordering → delivery flow triggers
- Additional card hold or Wisetack loan increment

### SSP + SCP Coordination
- SSP sees the Pro's perspective (what's needed, why)
- SCP sees the Client's perspective (cost impact, timeline impact)
- Both AI agents share context so the client gets a consistent story
- Human escalation when: change > 25% of budget, safety flagged, dispute

## Phase 7: Completion → Charge → Pay Pro

### Completion Criteria
1. All checklist tasks marked complete
2. All required photos uploaded
3. Wiseman verification: checklist is 100%, no open flagged items
4. Client sign-off: client reviews completed work in-app, confirms satisfaction
5. SCP follows up with client to ensure satisfaction (AI message, human call for Sherpa Plan)

### Payment Capture
- **Card hold:** Stripe captures the authorized amount (materials + fees + any change orders)
- **Wisetack:** Loan is already funded — no additional capture needed. Wisetack handles client repayment.
- **Labor payment:** Separate capture for the job bid amount (existing payment protection flow)

### Pro Payout
- Commission deducted (sliding 8-15% on labor)
- Materials handling fee already captured (Sherpa Pros keeps this)
- Remainder transferred to Pro via Stripe Connect
- If Pro used Stripe Capital: repayment automatically deducted from payout
- Payout timing: within 2 business days of completion

### Dispute Handling
- If client disputes quality: hold on payment, SSP + SCP review
- Checklist photos + Wiseman verification serve as evidence
- Mediation flow (existing `payment_disputes` table)
- If unresolved: human SSP and SCP escalate together

## Implementation Phases

### Phase 1 (MVP): Checklist Engine + Materials List
- Wiseman generates scope, process, checklist, materials for accepted jobs
- Pro reviews and adjusts materials in-app
- Wiseman validates changes (approve/warn/flag)
- Mock pricing (Pricing Wiseman data, not real-time HD)
- UI: checklist tab on job detail page, materials list component

### Phase 2: Real-Time Pricing + Ordering
- SerpApi integration for live Home Depot pricing by zip code
- Zinc API integration for order placement (BOPIS + delivery)
- Real pricing replaces mock pricing in materials list
- Delivery tier selection UI

### Phase 3: Payment + Financing
- Stripe card hold (capture_method: 'manual') for materials funding
- Wisetack embedded widget for client financing
- Stripe Capital for Pro cash flow (Stripe manages, we surface the offer)
- Fee calculation engine (12%/18%/25% tiered Sherpa Service Fee)
- Client approval flow with cost breakdown

### Phase 4: Gig Delivery + Change Orders
- Uber Connect / DoorDash Drive integration for emergency materials delivery
- Wiseman size/weight eligibility check
- Change order flow with threshold-based auto-approval
- SSP + SCP AI agent scaffolding

## API Integrations

| Service | Purpose | API | Auth | Cost |
|---------|---------|-----|------|------|
| SerpApi | HD product pricing + availability | REST, `engine=home_depot` | API key | $50/mo (5K searches) |
| Zinc API | Place HD orders (BOPIS + delivery) | REST | API key | ~$0.01-0.05/order |
| Wisetack | Client financing | REST + embedded widget | Partner API key | Free (they earn from APR) |
| Stripe | Card holds, Connect payouts, Capital | SDK (already integrated) | Already configured | 2.9% + 30¢ |
| Uber Connect | Gig delivery | REST | OAuth | Per-delivery pricing |
| DoorDash Drive | Gig delivery (backup) | REST | API key | Per-delivery pricing |

## Data Model Additions

### `job_checklists` table
- `id`, `job_id`, `type` (scope/process/checklist/materials), `content` (JSON), `wiseman_source`, `created_at`

### `materials_list` table
- `id`, `job_id`, `status` (draft/pro_reviewed/priced/approved/ordered/delivered)
- `total_cents`, `service_fee_cents`, `service_fee_pct` (12/18/25), `client_tier` (subscribed/one_time/emergency)

### `materials_items` table
- `id`, `materials_list_id`, `name`, `quantity`, `unit`, `spec`, `category`
- `hd_sku`, `hd_price_cents`, `hd_store_id`, `hd_stock_status`
- `added_by` (wiseman/pro), `pro_notes`, `wiseman_review` (approved/warning/flagged), `wiseman_notes`

### `materials_orders` table
- `id`, `materials_list_id`, `zinc_order_id`, `delivery_tier` (bopis/hd_delivery/gig/pro_choice)
- `status` (placed/confirmed/ready/picked_up/in_transit/delivered)
- `tracking_info` (JSON)

### `materials_funding` table
- `id`, `materials_list_id`, `method` (card_hold/wisetack)
- `stripe_payment_intent_id`, `wisetack_loan_id`
- `amount_cents`, `service_fee_cents`, `delivery_protection_cents`
- `status` (pending/authorized/captured/funded/refunded)

### `change_orders` table
- `id`, `job_id`, `materials_list_id`, `items` (JSON array of added items)
- `total_cents`, `auto_approved` (boolean), `client_approved_at`
- `wiseman_review`, `ssp_review`, `status` (pending/approved/rejected)
