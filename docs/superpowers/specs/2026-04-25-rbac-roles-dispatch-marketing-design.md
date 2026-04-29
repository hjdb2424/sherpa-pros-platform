# RBAC + 6 Roles + Multi-Trade Dispatch + Marketing — Design Spec

**Date:** 2026-04-25
**Status:** Approved

## Overview

7 workstreams in one session:
1. Role expansion (4 → 6 user types via role + subtype model)
2. Pro onboarding overhaul (skills checklist + verification gate)
3. RBAC middleware (route-level access enforcement)
4. Audit logs (DB table + admin UI)
5. Multi-trade job coordination
6. Dispatch model (materials supply chain: Wiseman → Supplier → Uber Connect)
7. Marketing content (Flex landing, feature showcase, invite updates)

---

## 1. Role + Subtype Model

### Schema Change

Add `subtype` column to `users` table. Drop `tenant` role — tenants are managed within PM flow.

| User Type | `role` | `subtype` | Fee | Description |
|-----------|--------|-----------|-----|-------------|
| Client: Residential | `client` | `residential` | — | Homeowners |
| Client: Residential Pro | `client` | `residential_pro` | — | Investors, multi-property |
| Client: Commercial | `client` | `commercial` | — | Retail, restaurants |
| Property Manager | `pm` | `null` | — | Desktop-first, finance |
| Pro: Standard | `pro` | `standard` | 12% | Own insurance |
| Pro: Flex | `pro` | `flex` | 18% | No LLC, per-project insurance, $5K limit |

### Role Selection UX

Two big buttons: "I need a Pro" / "I'm a Pro"
- "I need a Pro" → subtype picker: Homeowner / Investor / Commercial / Property Manager
- "I'm a Pro" → subtype picker: Standard (own insurance, 12%) / Flex (side-hustle, 18% includes insurance)

### Files Changed

- `src/lib/auth/roles.ts` — add subtypes, update constants
- `src/app/(auth)/select-role/page.tsx` — new subtype selection step
- `src/lib/demo-accounts.ts` — update all 23 accounts with subtypes
- `src/db/migrations/007_subtypes.sql` — ALTER users, ALTER access_list
- `src/components/onboarding/OnboardingWizard.tsx` — role-specific questions per subtype

---

## 2. Pro Onboarding Overhaul

### Skills Checklist (multi-select)

| Category | Skills |
|----------|--------|
| Painting & Walls | Interior painting, Exterior painting, Drywall install, Drywall repair, Wallpaper install/removal, Texture/skim coat |
| Doors & Windows | Door installation, Door repair, Window installation, Window repair, Screen repair, Weatherstripping |
| Exterior | Siding repair, Gutter cleaning/repair, Power washing, Deck repair/staining, Fence repair |
| Roofing | Shingle repair, Flashing repair, Roof leak patching, Gutter install |
| Plumbing (minor) | Faucet/fixture replacement, Toilet repair, Garbage disposal, Caulking/grouting |
| Electrical (minor) | Light fixture install, Outlet/switch replacement, Ceiling fan install |
| Smart Home & A/V | Smart thermostat/locks/cameras, TV/projector mounting, Surround sound install, Network setup (Wi-Fi/Ethernet), Doorbell cameras |
| Flooring | Tile install/repair, Laminate/vinyl install, Trim/baseboard install |
| Finish Carpentry | Crown molding, Wainscoting, Built-in shelving, Cabinet hardware, Window/door casing, Stair railing |
| Landscaping | Lawn care/mowing, Mulching/edging, Shrub/tree trimming, Garden bed install, Leaf/debris cleanup, Small irrigation repair |
| Assembly & Install | Furniture assembly, Shelf/closet install, Appliance install |
| General | Junk removal, Cleaning/turnover, Lock/hardware replacement, Caulking/sealing |
| Other | Free-text field |

### Verification Gate

Pro onboarding: 4 steps (was 3):
1. Personal info (name, email, phone)
2. Skills checklist + years of experience + city/state
3. Verification: upload 3-5 work photos + 2 references (name, phone, relationship)
4. Service radius + availability

New pros land in `verification_status: "pending"`. Admin approves at `/admin/verifications`.

### New Tables

- `pro_skills` — pro_id, skill_key, skill_category
- `pro_work_photos` — pro_id, url, caption, uploaded_at
- `pro_references` — pro_id, ref_name, ref_phone, ref_relationship, verified (boolean)
- `pros.verification_status` — enum: pending, approved, rejected

---

## 3. RBAC Middleware

### Implementation

Next.js middleware at `src/middleware.ts`:

```
/pro/*    → requires role === "pro"
/client/* → requires role === "client"
/pm/*     → requires role === "pm"
/admin/*  → requires is_admin flag
```

- Reads role from Clerk session or localStorage fallback
- Wrong role → redirect to correct dashboard
- No auth → redirect to /sign-in
- No role → redirect to /select-role

### Files

- `src/middleware.ts` — new file, route matching + role check
- `src/lib/auth/roles.ts` — add `getRouteForRole()`, `isAdminUser()`

---

## 4. Audit Logs

### Table: `audit_logs`

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id),
email TEXT,
action TEXT NOT NULL,
  -- sign_in, sign_out, role_change, access_granted, access_revoked,
  -- reward_redeemed, pro_verified, pro_rejected, job_created,
  -- material_approved, material_ordered, dispatch_triggered,
  -- delivery_requested, delivery_completed
target_type TEXT,  -- user, job, material_order, delivery
target_id UUID,
metadata JSONB DEFAULT '{}',
ip_address TEXT,
created_at TIMESTAMPTZ DEFAULT now()
```

### Admin UI

`/admin/logs` — filterable table:
- Filter by: action type, user email, date range
- Columns: timestamp, user, action, target, details (expandable)
- Paginated, 50 per page

### Helper

`logAudit(action, userId, metadata)` — called from API routes. Fire-and-forget (non-blocking).

---

## 5. Multi-Trade Job Coordination

### How It Works

1. Client posts job → Wiseman API analyzes scope, recommends trade breakdown
2. Platform creates linked sub-jobs: parent job + N child jobs (one per trade), sequenced
3. Platform dispatches each trade via skills-based matching
4. Coordination is automatic — Trade B notified when Trade A completes
5. Single invoice to client, itemized by trade

### Schema

- `jobs.parent_job_id` — nullable UUID self-reference
- `jobs.sequence_order` — integer, ordering within multi-trade job
- `jobs.trade_required` — skill_key from pro_skills (for matching)

### Wiseman Endpoint

`POST /api/wiseman/analyze-job` — input: job description → output: recommended trades[], materials[], estimated_hours, is_multi_trade boolean

### UI

- Job posting: after description, show Wiseman recommendation ("This job needs: Electrician + Smart Home Tech")
- Job detail: timeline showing sub-job sequence with status per trade
- Client view: single job card with trade breakdown accordion

---

## 6. Dispatch Model (Materials Supply Chain)

### Flow

```
Job accepted by pro
    ↓
Wiseman generates materials list (from job scope + pro skills)
    ↓
Pro reviews/adjusts → Client approves → Wiseman validates
    ↓
Pro heads to job site
    ↓
API → Supplier (Home Depot via Zinc / Sherpa Hub)
    ↓
Order confirmed
    ↓
API → Uber Connect: pickup from supplier, deliver to job site
    ↓
Pro receives materials on-site
    ↓
No wasted hours shopping/traveling
```

### New Tables

**`job_materials`**
- job_id, material_name, quantity, unit, estimated_cost_cents
- supplier_source (zinc/sherpa_hub/manual)
- supplier_product_id (for API ordering)
- status: recommended → pro_approved → client_approved → ordered → picked_up → delivered
- wiseman_note (recommendation text)

**`material_orders`**
- job_id, supplier_api (zinc/sherpa_hub), external_order_id
- status: pending → confirmed → ready_for_pickup → picked_up → delivered
- total_cents, items_count
- pickup_address, pickup_instructions

**`delivery_requests`**
- material_order_id, uber_delivery_id
- pickup_address, dropoff_address (job site)
- status: requested → driver_assigned → picked_up → in_transit → delivered
- eta_minutes, actual_delivery_at
- cost_cents

### API Endpoints

- `POST /api/wiseman/materials-review` — validates materials list, recommends alternatives
- `POST /api/materials/order` — places order via Zinc (Home Depot) or Sherpa Hub
- `POST /api/delivery/request` — creates Uber Connect delivery
- `GET /api/delivery/status/:id` — polls delivery status

### UI

- Job detail → "Materials" tab: list with approval checkboxes, status badges
- Dispatch timeline: visual steps (Ordered → Picked Up → In Transit → Delivered)
- Pro view: "Materials on the way" card with ETA
- Client view: materials cost breakdown with approval buttons

---

## 7. Marketing Content

### /flex Landing Page

URL: `/flex`
Hero: "Do work on the side? We've got you covered."
Sections:
- What is Sherpa Flex? (18% fee includes insurance, no LLC needed)
- How it works (sign up → verify → get matched → get paid)
- Who it's for (handymen, weekend warriors, skilled tradespeople between jobs, retirees)
- $5K job limit, background check required
- Upgrade path to Standard (12%)
- CTA: Join waitlist / Apply now

### Splash Page Updates

- Ecosystem section: add Flex messaging
- New "Platform Features" showcase section highlighting ALL built features:
  - Sherpa Score, Rewards, Smart Scan OCR, Messaging + SMS sync
  - Combined Maintenance, Finance Hub, Payment Protection
  - Code-verified quotes, 37 categories / 251+ services
  - Sherpa Success Manager
  - NEW: Dispatch Model ("Materials delivered to the job site")
  - NEW: Multi-Trade Coordination ("One job, multiple trades, zero hassle")

### Invite Page Updates

- `/invite/pro` — mention Flex option
- About page — add Flex info + feature highlights

### Design

- Same dark premium theme as existing splash
- Animated gradient backgrounds
- ScrollFadeIn transitions
- Brand colors: #00a9e0 primary, #ff4500 accent

---

## Migration Plan

**Migration 007:** subtypes + pro_skills + verification
**Migration 008:** audit_logs
**Migration 009:** multi-trade (parent_job_id, sequence_order, trade_required)
**Migration 010:** dispatch (job_materials, material_orders, delivery_requests)
