# Sherpa Pros — Production Launch + Hub Beta + Migration Architecture

**Date:** 2026-04-25
**Status:** Approved

## Overview

Single combined spec to take Sherpa Pros from beta-with-mock-data to production-with-real-money. Three pillars built simultaneously:

1. **Production integrations** — real Stripe payments, real Twilio messaging, real file storage
2. **Sherpa Hub beta** — warehouse inventory with QR scanning, RFID access, pick-list workflow
3. **Migration-ready architecture** — service abstraction layer so Vercel → containers is a config change

## Current State (from audit)

| Integration | Status | Gap |
|-------------|--------|-----|
| Neon PostgreSQL | LIVE | Production ready |
| Google Maps | LIVE | Production ready |
| Google OAuth | LIVE | Working with mock fallback |
| Dispatch Wiseman | LIVE | 7-factor algorithm active |
| Zinc API (Home Depot) | LIVE | zn_live_ key configured |
| Stripe | TEST MODE | Placeholders, no real capture/payout |
| Twilio | CREDENTIALS SET | SDK not installed, mock service only |
| Uber Connect | CREDENTIALS SET | All API calls return mock |
| File Storage | NONE | No S3/R2/Blob configured |
| Clerk Auth | NOT WIRED | Package installed, not active |
| Tremendous | PENDING | Awaiting API approval |

---

## 1. Service Abstraction Layer

### Pattern

Every external integration follows the same pattern:

```typescript
// src/lib/services/interfaces.ts
interface PaymentService {
  createConnectedAccount(userId: string, email: string): Promise<ConnectAccount>;
  capturePayment(jobId: string, amountCents: number): Promise<PaymentResult>;
  releasePayout(paymentId: string, proAccountId: string, commissionRate: number): Promise<PayoutResult>;
  // ...
}

// src/lib/services/payments/index.ts
export function getPaymentService(): PaymentService {
  if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') || process.env.STRIPE_SECRET_KEY?.startsWith('sk_test')) {
    return new StripePaymentService();
  }
  return new MockPaymentService();
}
```

### Service Directory

```
src/lib/services/
  interfaces.ts              # All service interfaces in one file
  payments/
    index.ts                 # getPaymentService()
    stripe-service.ts        # Real Stripe Connect implementation
    mock-service.ts          # Dev/test mock
  messaging/
    index.ts                 # getMessagingService()
    twilio-service.ts        # Real Twilio Conversations
    mock-service.ts          # In-memory mock (existing)
  delivery/
    index.ts                 # getDeliveryService()
    uber-service.ts          # Real Uber Connect
    doordash-service.ts      # Real DoorDash Drive
    mock-service.ts          # Mock estimates
  storage/
    index.ts                 # getStorageService()
    r2-service.ts            # Cloudflare R2 (S3-compatible)
    mock-service.ts          # Local filesystem mock
  hub/
    index.ts                 # getHubService()
    inventory-service.ts     # Inventory CRUD + QR validation
    access-service.ts        # RFID/QR entry/exit logging
    equipment-service.ts     # Rental tracking
  queue/
    index.ts                 # getQueueService()
    in-process-queue.ts      # Current: runs in-process
    qstash-queue.ts          # Future: Upstash QStash
```

### Migration Rules (enforced now)

1. **No direct DB imports in pages/components.** All data through services or `src/db/queries/`.
2. **Environment-based service selection.** Each `getXService()` reads env vars to pick implementation.
3. **Stateless API routes.** No in-memory session state. Neon + cookies only.
4. **Queue-ready operations.** Long tasks (order placement, delivery polling, notifications) go through `src/lib/services/queue/` — runs in-process now, becomes QStash/BullMQ when containerized.
5. **Health check.** `/api/health` returns status of every service. Becomes container health probe later.

---

## 2. Real Payments (Stripe Connect)

### Dependencies
- `stripe` package (already in package.json v22.0.1)
- Environment: switch `sk_test_` → `sk_live_` when ready (one env var)

### Connect Onboarding Flow

```
Pro signs up → Platform creates Stripe Connected Account (Standard type)
  → Pro completes Stripe onboarding (hosted form)
  → Webhook: account.updated → mark pro.stripe_account_id + stripe_onboarded = true
  → Pro can now receive payouts
```

### Payment Flow (per job milestone)

```
Client funds milestone
  → PaymentIntent created (amount = milestone + service_fee)
  → Stripe holds funds
  → Pro completes work + client approves
  → Platform creates Transfer to pro's connected account
  → Transfer amount = milestone - commission
  → Commission stays in platform Stripe balance
```

### Commission Rates (already in commission.ts)
- Pro Standard: 12%
- Pro Flex: 18% (includes insurance allocation)
- Pro Gold: 8%
- Pro Silver: 12%
- Pro Bronze: 12%

### Database Changes
- `users.stripe_account_id` — VARCHAR, nullable
- `users.stripe_onboarded` — BOOLEAN, default false
- `payments` table already exists — add `stripe_payment_intent_id`, `stripe_transfer_id`

### API Endpoints
- `POST /api/stripe/connect/account` — create or fetch connected account
- `POST /api/stripe/connect/account-session` — generate AccountSession for embedded onboarding component
- `POST /api/stripe/webhook` — handle payment_intent.succeeded, account.updated, transfer.created, charge.dispute.created
- `POST /api/payments/capture` — capture payment for milestone
- `POST /api/payments/release` — release payout to pro

### Webhook Events to Handle
- `account.updated` — pro onboarding complete
- `payment_intent.succeeded` — client payment captured
- `transfer.created` — pro payout confirmed
- `charge.dispute.created` — flag for manual review
- `payout.failed` — alert pro, retry

---

## 3. Real Messaging (Twilio)

### Dependencies
- Install `twilio` package (not currently in package.json)

### Implementation
- Wire `twilioService` in `src/lib/communication/twilio-service.ts`
- Replace TODO stubs with real Conversations API calls:
  - `createConversation(jobId, proPhone, clientPhone)` → Twilio Conversation
  - `sendMessage(conversationSid, body, senderRole)` → Message
  - `getMessages(conversationSid)` → Message[]
- SMS sync: when client sends in-app message, pro gets SMS and vice versa
- Webhook: `/api/chat/twilio-webhook` for incoming SMS → route to conversation

### Existing Pattern
The mock/real fallback already exists in `src/lib/communication/index.ts`. Just need to implement the real service.

---

## 4. File Storage (Cloudflare R2)

### Why R2
- S3-compatible API (zero code changes to migrate to AWS S3 or DO Spaces)
- Free egress (saves money on image-heavy app)
- Works with any provider later
- Presigned URLs for direct client upload (no server bottleneck)

### Implementation
- Bucket: `sherpa-pros-uploads`
- Path convention: `{type}/{userId}/{timestamp}-{filename}`
  - Types: `verification-photos`, `job-photos`, `receipts`, `documents`, `profile-photos`
- Presigned upload URL generation in `/api/uploads/presign`
- Store resulting URL in Neon (not the file itself)

### Used By
- Pro verification (3-5 work photos during onboarding)
- OCR Smart Scan (receipt/document uploads)
- Job photos (before/during/after)
- Pro profile photos
- Hub shipment documentation

---

## 5. Sherpa Hub Beta — Warehouse System

### Core Concept

Pros have warehouse access. They arrive, badge in, pick materials for their job using the app + QR codes, and leave. Inventory is tracked in real-time. End of day, a laborer reconciles counts.

### The Pick Flow

```
1. PRO ARRIVES
   └── Taps RFID badge at door reader
   └── System logs entry: pro_id, hub_id, timestamp, method: "rfid"
   └── Door unlocks (future: automated; now: manual unlock after badge tap)

2. PRO OPENS APP → "Pick Materials"
   └── Selects active job from list
   └── Sees pick list (from job_materials table)
   └── Each item shows: name, quantity needed, bin location, QR code to scan

3. PRO PICKS ITEMS
   └── Walks to bin location (e.g., "Aisle 3, Shelf B, Bin 12")
   └── Scans QR code on bin/item with phone camera
   └── App validates: correct item? correct quantity?
   └── App deducts from hub_inventory.quantity_on_hand
   └── Creates hub_inventory_transaction (type: "picked", reference: job_id)

4. PRO CHECKS OUT
   └── App shows summary: "Picked 5 items for Job #1234"
   └── Pro confirms → items assigned to job
   └── Pro exits warehouse
   └── RFID logs exit: pro_id, hub_id, timestamp

5. END OF DAY RECONCILIATION
   └── Laborer opens admin app → "Inventory Count"
   └── Walks aisles, counts items, enters actual counts
   └── System compares: expected vs actual
   └── Discrepancies flagged for review
   └── Reconciliation report generated
```

### QR Code System

Each inventory item/bin gets a QR code containing:
```json
{
  "type": "hub_item",
  "hub_id": "hub-001",
  "item_id": "item-uuid",
  "sku": "HD-12345",
  "bin": "A3-B-12"
}
```

QR codes are generated server-side, printed on labels. The app's camera scanner reads them and validates against the pick list.

### Database — Migration 011

```sql
-- Hub locations
CREATE TABLE hub_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'warehouse',
  operating_hours JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory items
CREATE TABLE hub_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  sku VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(60),
  description TEXT,
  unit VARCHAR(20) DEFAULT 'each',
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER DEFAULT 5,
  reorder_quantity INTEGER DEFAULT 20,
  bin_location VARCHAR(30),
  unit_cost_cents INTEGER,
  supplier VARCHAR(100),
  supplier_sku VARCHAR(50),
  qr_code_data TEXT,
  last_counted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(hub_id, sku)
);
CREATE INDEX idx_hub_inventory_hub ON hub_inventory(hub_id);
CREATE INDEX idx_hub_inventory_sku ON hub_inventory(sku);
CREATE INDEX idx_hub_inventory_bin ON hub_inventory(bin_location);
CREATE INDEX idx_hub_inventory_low_stock ON hub_inventory(hub_id) 
  WHERE quantity_on_hand <= reorder_point;

-- Inventory transactions (immutable ledger)
CREATE TABLE hub_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  item_id UUID NOT NULL REFERENCES hub_inventory(id),
  type VARCHAR(20) NOT NULL,
    -- received, picked, returned, adjusted, kitted, counted, damaged, scrapped
  quantity INTEGER NOT NULL,
    -- positive = add, negative = remove
  reference_type VARCHAR(20),
    -- job, shipment, count, manual
  reference_id UUID,
  user_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_hub_txn_item ON hub_inventory_transactions(item_id);
CREATE INDEX idx_hub_txn_type ON hub_inventory_transactions(type);
CREATE INDEX idx_hub_txn_created ON hub_inventory_transactions(created_at DESC);

-- Access control log
CREATE TABLE hub_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  user_id UUID REFERENCES users(id),
  visitor_name VARCHAR(100),
  action VARCHAR(10) NOT NULL,
    -- entry, exit
  method VARCHAR(20) NOT NULL,
    -- rfid, qr, manual, visitor_badge
  badge_id VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_hub_access_hub ON hub_access_log(hub_id);
CREATE INDEX idx_hub_access_user ON hub_access_log(user_id);
CREATE INDEX idx_hub_access_time ON hub_access_log(timestamp DESC);

-- Equipment inventory
CREATE TABLE hub_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(60),
  serial_number VARCHAR(100),
  condition VARCHAR(20) DEFAULT 'good',
    -- new, good, fair, needs_repair, retired
  status VARCHAR(20) DEFAULT 'available',
    -- available, rented, maintenance, retired
  daily_rate_cents INTEGER DEFAULT 0,
  replacement_value_cents INTEGER,
  last_maintenance_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Equipment rentals
CREATE TABLE hub_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES hub_equipment(id),
  pro_id UUID NOT NULL REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  checkout_at TIMESTAMPTZ DEFAULT now(),
  expected_return TIMESTAMPTZ NOT NULL,
  actual_return TIMESTAMPTZ,
  condition_out VARCHAR(20),
  condition_in VARCHAR(20),
  daily_rate_cents INTEGER NOT NULL,
  total_charged_cents INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_hub_rentals_equipment ON hub_rentals(equipment_id);
CREATE INDEX idx_hub_rentals_pro ON hub_rentals(pro_id);

-- Shipments (inbound receiving + outbound shipping)
CREATE TABLE hub_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  type VARCHAR(10) NOT NULL,
    -- inbound, outbound
  carrier VARCHAR(50),
  tracking_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
    -- pending, in_transit, received, shipped, delivered
  items JSONB DEFAULT '[]',
    -- [{item_id, sku, quantity_expected, quantity_received}]
  job_id UUID REFERENCES jobs(id),
  supplier_order_id UUID REFERENCES material_orders(id),
  received_by UUID REFERENCES users(id),
  shipped_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_hub_shipments_hub ON hub_shipments(hub_id);
CREATE INDEX idx_hub_shipments_tracking ON hub_shipments(tracking_number);

-- Inventory count sessions (reconciliation)
CREATE TABLE hub_count_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  counted_by UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'in_progress',
    -- in_progress, completed, reviewed
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_items_counted INTEGER DEFAULT 0,
  discrepancies_found INTEGER DEFAULT 0,
  notes TEXT
);

-- Individual count entries
CREATE TABLE hub_count_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES hub_count_sessions(id),
  item_id UUID NOT NULL REFERENCES hub_inventory(id),
  expected_quantity INTEGER NOT NULL,
  counted_quantity INTEGER NOT NULL,
  discrepancy INTEGER GENERATED ALWAYS AS (counted_quantity - expected_quantity) STORED,
  notes TEXT,
  counted_at TIMESTAMPTZ DEFAULT now()
);
```

### Hub API Endpoints

```
Inventory:
  GET    /api/hub/inventory              — list items (filterable by category, low-stock)
  GET    /api/hub/inventory/:id          — item detail
  POST   /api/hub/inventory              — add new item
  PATCH  /api/hub/inventory/:id          — update item
  POST   /api/hub/inventory/scan         — QR scan → validate + return item info
  GET    /api/hub/inventory/low-stock    — items below reorder point

Pick Flow:
  GET    /api/hub/pick/:jobId            — get pick list for job
  POST   /api/hub/pick/:jobId/scan       — scan item QR, validate against pick list
  POST   /api/hub/pick/:jobId/confirm    — confirm all items picked, deduct inventory

Access Control:
  POST   /api/hub/access/entry           — log RFID/QR entry
  POST   /api/hub/access/exit            — log exit
  GET    /api/hub/access/log             — access history (filterable)
  GET    /api/hub/access/active          — who's in the warehouse right now

Equipment:
  GET    /api/hub/equipment              — list available equipment
  POST   /api/hub/equipment/checkout     — rent equipment to pro
  POST   /api/hub/equipment/return       — return equipment
  GET    /api/hub/equipment/overdue      — overdue rentals

Receiving:
  POST   /api/hub/receiving/scan         — scan incoming shipment
  POST   /api/hub/receiving/confirm      — confirm received quantities
  GET    /api/hub/shipments              — shipment history

Reconciliation:
  POST   /api/hub/count/start            — begin count session
  POST   /api/hub/count/:sessionId/entry — record item count
  POST   /api/hub/count/:sessionId/complete — finish session, generate report
  GET    /api/hub/count/:sessionId       — view count results + discrepancies
```

### Hub UI Pages

```
Pro App (mobile-first):
  /pro/hub/pick/:jobId       — pick list with QR scanner
  /pro/hub/equipment         — browse/checkout equipment

Admin:
  /admin/hub/inventory       — full inventory management
  /admin/hub/access          — access log + who's in warehouse
  /admin/hub/receiving       — inbound shipment processing
  /admin/hub/equipment       — equipment status + overdue
  /admin/hub/count           — start/view reconciliation sessions
  /admin/hub/count/:id       — discrepancy report
```

### QR Code Generation
- Server generates QR containing JSON payload (hub_id, item_id, sku, bin)
- Printed on adhesive labels for bins/shelves
- App reads QR via phone camera (no special hardware needed)
- Validation: QR data matched against pick list in real-time

### Site Access — Ubiquiti UniFi Access (Phase 1)

Hardware stack:
- **UniFi Access Hub** — controller for door locks + readers
- **UniFi Access Reader Pro** — NFC/RFID at warehouse entry (supports badges + phone tap)
- **UniFi Access Lock** — electric door lock (auto-unlock on valid badge)
- **UniFi Protect cameras** — entry/exit + warehouse floor coverage
- **UniFi Network** — Dream Machine Pro for networking, PoE switches for cameras/readers

Integration approach:
- UniFi Access has a **local API** (REST) for door events, user management, access policies
- `/api/hub/access/unifi-webhook` — receives door open/close events from UniFi Access Hub
- When pro badges in: UniFi sends event → our webhook logs entry → door unlocks automatically
- When pro exits: same flow in reverse
- **Access policies:** set per-pro schedules (e.g., warehouse open 6am-6pm, no weekend access for Flex pros)
- Pro badges: NFC cards provisioned through UniFi Access admin, linked to pro's user_id in our DB
- Phone tap: UniFi Access Reader Pro supports NFC from iPhone/Android — pros can use phone instead of badge

Camera integration (Protect API):
- Entry/exit cameras capture face + timestamp on every door event
- Tied to access_log entry for visual verification
- Floor cameras: manual review now, AI object detection later (count items on shelves)
- Protect API provides snapshot URLs that we store as references in hub_access_log

Network segmentation:
- VLAN 1: Hub operations (POS, tablets, kiosks)
- VLAN 2: IoT devices (cameras, readers, sensors)
- VLAN 3: Guest Wi-Fi (pros in warehouse)
- Firewall rules: IoT VLAN can only talk to UniFi controller + our API webhook endpoint

Estimated hardware cost (1 warehouse):
- Dream Machine Pro: $379
- Access Hub: $99
- Access Reader Pro x2 (entry + exit): $598
- Access Lock x2: $598
- Protect G5 Bullet cameras x4: $796
- PoE switch (USW-Lite-16-PoE): $199
- NFC badges (50 pack): ~$50
- **Total: ~$2,700**

### Camera/AI Upgrade Path (Phase 2 — Later)
- Cameras at entry/exit for visual verification
- Shelf cameras for real-time inventory monitoring
- Computer vision: detect item removal, count stock levels
- This is a future module — QR + manual count is the MVP

---

## 6. Database Changes Summary

**Migration 011:** Hub tables (hub_locations, hub_inventory, hub_inventory_transactions, hub_access_log, hub_equipment, hub_rentals, hub_shipments, hub_count_sessions, hub_count_entries)

**Migration 012:** Stripe fields (users.stripe_account_id, users.stripe_onboarded, payments.stripe_transfer_id updates)

---

## 7. Controlled Rollout Plan

### Beta Cohort
- 10-15 pros (from recruiting kit — 55 named NE contractors)
- 5-10 clients (NH residential, invited)
- 1 hub location (your warehouse)
- Geography: NH only (expand to NE after 30 days)

### Feature Gates
- Stripe: live mode but with $500 max job limit during beta
- Hub: your warehouse only, you control physical access
- Dispatch: Zinc live for Home Depot ordering, Uber Connect for delivery
- All actions audit-logged

### Rollout Sequence
1. Week 1: Invite pros, onboard to platform + Stripe Connect
2. Week 2: Invite clients, first real jobs posted
3. Week 3: First real payments processed, first Hub pick-ups
4. Week 4: Review metrics, fix issues, expand cohort

---

## 8. Health Check + Monitoring

### /api/health Endpoint

Returns status of every service:

```json
{
  "status": "healthy",
  "timestamp": "2026-04-25T22:00:00Z",
  "services": {
    "database": { "status": "up", "latency_ms": 12 },
    "stripe": { "status": "up", "mode": "live" },
    "twilio": { "status": "up" },
    "zinc": { "status": "up" },
    "uber": { "status": "up" },
    "storage": { "status": "up", "provider": "r2" },
    "hub": { "status": "up", "items_tracked": 156 }
  }
}
```

This becomes the container health probe when migrated.

### Audit Trail
Every financial transaction, access event, and inventory change is logged to `audit_logs` (already built tonight). No data flow happens without a trace.

---

## 9. Migration Path (Vercel → Containers)

When traffic warrants it, the migration is:

1. **Extract services to standalone Node.js apps** — each `src/lib/services/X` becomes its own container. The interface stays identical.
2. **API gateway** — Vercel becomes a thin proxy to backend services (already using proxy.ts pattern).
3. **Database** — Neon supports connection pooling. Add read replicas when needed. No schema changes.
4. **Queue** — Swap `in-process-queue.ts` for `qstash-queue.ts` or BullMQ. Same interface.
5. **Storage** — R2 is S3-compatible. Works from any host.

**Estimated migration effort:** 2-3 days for a clean cutover with zero downtime (blue-green deployment). The service abstraction layer makes this possible because no business logic touches infrastructure directly.
