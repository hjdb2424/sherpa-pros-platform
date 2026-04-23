# Sherpa Hub -- Physical + Digital Supply Model

**Date:** 2026-04-15
**Status:** Design Spec

---

## 1. Hub Architecture

### Physical Layout (3,000 sqft baseline)

```
+----------------------------------------------------------+
|  WAREHOUSE (60% = 1,800 sqft)                            |
|  [Bulk Rack A-F] [Kit Assembly] [Tool Cage] [Staging]    |
+----------------------------------------------------------+
|  SHOWROOM (20% = 600 sqft)        | TRAINING (20% = 600) |
|  [POS Counter] [Tool Demo Wall]   | [12-seat classroom]  |
|  [Digital Kiosk] [Pickup Window]  | [Demo benches]       |
+----------------------------------------------------------+
```

### Software Modules (extends existing `src/app/api/`)

| Module | Route | Purpose |
|--------|-------|---------|
| Inventory | `/api/hub/inventory` | Real-time stock, barcode scan, reorder triggers |
| Kits | `/api/hub/kits` | Kit catalog, assembly workflow, job-matched ordering |
| Rentals | `/api/hub/rentals` | Equipment checkout/return, deposits, damage tracking |
| Training | `/api/hub/training` | Event calendar, registration, cert issuance |
| Delivery | `/api/hub/delivery` | Gig dispatch for kit/tool delivery to job site |

---

## 2. Kit Catalog -- HD Retail vs Sherpa Hub

All prices are material-only, no labor. Sherpa bulk = 20-30% below HD retail via direct-buy (Schluter, Laticrete, DAP, GreenGuard). Hub margin 12% on bulk cost.

| Kit | Contents Summary | HD Retail | Sherpa Hub | Pro Saves |
|-----|-----------------|-----------|------------|-----------|
| Bathroom Remodel (std 5x8) | Cement board, Kerdi membrane, thinset, grout, caulk, screws, mixing bucket | $485 | $340 | $145 (30%) |
| Kitchen Faucet Swap | Faucet supply lines, shutoff valves, plumber's putty, teflon, basin wrench rental | $65 | $45 | $20 (31%) |
| Panel Upgrade 100A-200A | 200A panel, breakers (20), wire (SE 2/0), ground rod, conduit, connectors | $1,280 | $920 | $360 (28%) |
| Deck Build (per 100 sqft) | PT joists, deck boards, joist hangers, lag bolts, flashing, screws | $1,850 | $1,350 | $500 (27%) |
| Interior Paint Room (12x12) | 2 gal premium paint, primer, roller kit, tape, drop cloth, caulk, spackle | $185 | $130 | $55 (30%) |
| Emergency Plumbing (burst pipe) | SharkBite couplings (4), pipe cutter, CPVC/PEX (10ft), bucket, towels, flashlight | $145 | $105 | $40 (28%) |
| Exterior Paint (per 1000 sqft) | 8 gal exterior paint, primer, brushes, roller system, caulk, scraper, ladder rental | $680 | $490 | $190 (28%) |
| Tile Floor (per 100 sqft) | Porcelain tile, thinset, grout, spacers, leveling clips, saw blade rental | $750 | $530 | $220 (29%) |
| Rough-In Plumbing (1 bath) | PEX manifold, fittings, hangers, valves, drain/vent DWV, test caps | $420 | $295 | $125 (30%) |
| Insulation (per 1000 sqft attic) | R-38 batts, vapor barrier, staples, utility knife, dust mask, headlamp | $890 | $640 | $250 (28%) |

---

## 3. Equipment Rental Catalog

Deposit = 50% of retail value, held on card. Insurance $5/day optional. Delivery $25 flat within hub radius.

| Tool | Retail | Daily | Weekly | Monthly | Break-Even Days |
|------|--------|-------|--------|---------|-----------------|
| Festool TS 55 Track Saw | $620 | $45 | $150 | $400 | 14 |
| Festool CT 36 Dust Extractor | $730 | $50 | $170 | $450 | 15 |
| Festool RO 150 Sander | $540 | $40 | $130 | $350 | 14 |
| Hilti TE 60-ATC Rotary Hammer | $2,200 | $85 | $290 | $750 | 26 |
| Hilti DD 150 Core Drill | $4,800 | $150 | $500 | $1,300 | 32 |
| Hilti PM 30-MG Laser Level | $1,100 | $55 | $185 | $480 | 20 |
| SawStop PCS 3HP Table Saw | $3,500 | $110 | $375 | $950 | 32 |
| Makita XGT 80V Miter Saw | $850 | $55 | $185 | $480 | 16 |
| Makita AWS Planer (cordless) | $680 | $45 | $150 | $400 | 16 |
| Bosch GRL 4000-80CHVK Laser | $1,500 | $70 | $240 | $620 | 22 |
| Wacker Neuson VP1340 Compactor | $3,200 | $95 | $325 | $840 | 34 |
| Wacker Neuson BS 50-4 Rammer | $2,800 | $85 | $290 | $750 | 33 |
| Mafell Erika 85 Pull-Push Saw | $3,800 | $120 | $400 | $1,050 | 32 |
| Fein MultiMaster 700 | $420 | $35 | $120 | $310 | 12 |
| Milwaukee MX FUEL Breaker | $3,200 | $100 | $340 | $880 | 32 |
| Husqvarna K770 Cutoff Saw | $1,400 | $65 | $220 | $570 | 22 |
| Leica Disto X4 Laser Measure | $550 | $35 | $120 | $310 | 16 |
| Bluebeam Revu + iPad Setup | $800 | $50 | $170 | $440 | 16 |
| Spray Foam Rig (Graco) | $8,500 | $250 | $850 | $2,200 | 34 |
| Pipe Threading Machine (Ridgid) | $4,200 | $130 | $440 | $1,150 | 33 |

**Target utilization:** 60% (15 rental-days/month per tool). At $60 avg daily rate x 20 tools x 15 days = $18,000/mo rental revenue.

---

## 4. Training Program Calendar (Annual Rotation)

| Month | Course | Sponsor | Duration | Fee | Cert |
|-------|--------|---------|----------|-----|------|
| Jan | OSHA 10-Hour Construction | OSHA/Sherpa | 2 days | $75 | OSHA-10 Card |
| Feb | Festool Track Saw + Dust-Free | Festool | 4 hrs | Free | Festool Certified |
| Mar | Hilti Anchor Systems (ICC/ESR) | Hilti | 6 hrs | Free | Hilti Cert |
| Apr | Lead Paint RRP Certification | EPA/Sherpa | 8 hrs | $200 | EPA RRP Card |
| May | Milwaukee M18/MX Platform | Milwaukee | 4 hrs | Free | Milwaukee Pro |
| Jun | Spray Foam Insulation | Demilec/Lapolla | 8 hrs | $150 | Installer Cert |
| Jul | Schluter Shower Systems | Schluter | 4 hrs | Free | Schluter Certified |
| Aug | SawStop Safety + Cabinet Saws | SawStop | 3 hrs | Free | SawStop Cert |
| Sep | Estimating with Sherpa Tools | Sherpa Pros | 4 hrs | $50 | Hub Estimator |
| Oct | Concrete Form + Pour (ICF) | Fox Blocks | 6 hrs | Free | ICF Installer |
| Nov | Weatherization + Energy Audit | BPI/Sherpa | 8 hrs | $175 | BPI Cert |
| Dec | First Aid / CPR for Job Sites | Red Cross | 4 hrs | $85 | FA/CPR Card |

**Revenue per event:** Manufacturer-sponsored = $2,000-$5,000 venue fee paid to Sherpa. Self-hosted (OSHA, RRP, BPI) = attendee fees cover instructor cost. All certs appear on pro's Sherpa profile.

---

## 5. Inventory Management Data Model

Extends the existing `hubs` table. New tables for the Hub module:

```sql
-- Kit templates (generated from Assembly Wiseman data)
CREATE TABLE hub_kit_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    name            VARCHAR(255) NOT NULL,       -- "Bathroom Remodel Kit (5x8)"
    category        VARCHAR(100) NOT NULL,        -- plumbing, electrical, finish, etc.
    sku             VARCHAR(50) UNIQUE NOT NULL,
    items           JSONB NOT NULL,               -- [{product_id, qty, unit}]
    retail_cents    INTEGER NOT NULL,              -- HD retail comparison price
    hub_price_cents INTEGER NOT NULL,              -- Sherpa hub price
    assembly_ref    VARCHAR(100),                  -- Assembly Wiseman reference ID
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Physical inventory per hub
CREATE TABLE hub_inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    product_name    VARCHAR(255) NOT NULL,
    sku             VARCHAR(50) NOT NULL,
    barcode         VARCHAR(50),
    qty_on_hand     INTEGER NOT NULL DEFAULT 0,
    qty_reserved    INTEGER NOT NULL DEFAULT 0,
    reorder_point   INTEGER NOT NULL DEFAULT 5,
    reorder_qty     INTEGER NOT NULL DEFAULT 20,
    unit_cost_cents INTEGER NOT NULL,              -- Sherpa bulk buy cost
    supplier        VARCHAR(255),
    location_bin    VARCHAR(20),                    -- "A3-02" (rack-shelf)
    last_counted    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (hub_id, sku)
);

-- Equipment available for rental
CREATE TABLE hub_equipment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    name            VARCHAR(255) NOT NULL,         -- "Festool TS 55 Track Saw"
    brand           VARCHAR(100) NOT NULL,
    model           VARCHAR(100),
    serial_number   VARCHAR(100) UNIQUE,
    retail_cents    INTEGER NOT NULL,               -- replacement value
    daily_rate      INTEGER NOT NULL,               -- cents
    weekly_rate     INTEGER NOT NULL,
    monthly_rate    INTEGER NOT NULL,
    deposit_cents   INTEGER NOT NULL,               -- 50% of retail
    status          VARCHAR(20) DEFAULT 'available'
                    CHECK (status IN ('available','rented','maintenance','retired')),
    condition_notes TEXT,
    next_service    DATE,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Rental transactions
CREATE TABLE hub_rentals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id    UUID NOT NULL REFERENCES hub_equipment(id),
    pro_id          UUID NOT NULL REFERENCES pros(id),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    checked_out     TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_back        TIMESTAMPTZ NOT NULL,
    returned_at     TIMESTAMPTZ,
    rate_type       VARCHAR(10) CHECK (rate_type IN ('daily','weekly','monthly')),
    total_cents     INTEGER NOT NULL,
    deposit_cents   INTEGER NOT NULL,
    deposit_status  VARCHAR(15) DEFAULT 'held'
                    CHECK (deposit_status IN ('held','released','claimed')),
    condition_out   TEXT,
    condition_in    TEXT,
    damage_cents    INTEGER DEFAULT 0,
    stripe_hold_id  VARCHAR(255),                   -- Stripe PaymentIntent for deposit
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Training events
CREATE TABLE hub_training_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    title           VARCHAR(255) NOT NULL,
    sponsor         VARCHAR(255),
    instructor      VARCHAR(255),
    event_date      DATE NOT NULL,
    start_time      TIME NOT NULL,
    duration_hours  DECIMAL(4,1) NOT NULL,
    max_seats       INTEGER NOT NULL DEFAULT 12,
    fee_cents       INTEGER DEFAULT 0,
    sponsor_fee_cents INTEGER DEFAULT 0,            -- what sponsor pays Sherpa
    cert_type       VARCHAR(100),                   -- maps to pro_certifications.cert_type
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Training registrations
CREATE TABLE hub_training_registrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES hub_training_events(id),
    pro_id          UUID NOT NULL REFERENCES pros(id),
    status          VARCHAR(15) DEFAULT 'registered'
                    CHECK (status IN ('registered','attended','no_show','cancelled')),
    paid_cents      INTEGER DEFAULT 0,
    cert_issued     BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (event_id, pro_id)
);

-- Kit orders (pro orders a kit for a specific job)
CREATE TABLE hub_kit_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kit_template_id UUID NOT NULL REFERENCES hub_kit_templates(id),
    pro_id          UUID NOT NULL REFERENCES pros(id),
    job_id          UUID REFERENCES jobs(id),
    hub_id          UUID NOT NULL REFERENCES hubs(id),
    quantity        INTEGER NOT NULL DEFAULT 1,
    total_cents     INTEGER NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','assembling','ready','picked_up','delivered','cancelled')),
    delivery_type   VARCHAR(10) DEFAULT 'pickup'
                    CHECK (delivery_type IN ('pickup','delivery')),
    delivery_address TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Manufacturer Partnership Pitch

**What Sherpa offers manufacturers:**

- **Captive audience:** 200+ verified, active contractors in the Seacoast NH market (growing)
- **Training venue:** 600 sqft classroom, 12 seats, projector, demo benches -- zero setup cost for manufacturer reps
- **Rental fleet as demo:** Every rental is a 1-30 day product trial. Conversion to purchase: 15-25% historically (Hilti fleet model)
- **Purchase funnel:** Contractor tries tool on rental, attends training, gets 10% Sherpa-exclusive discount code -- buys direct. Sherpa earns 5-8% referral commission
- **Data:** Sherpa knows which tools get rented most, by which trades, for which job types. Manufacturers get anonymized usage reports quarterly
- **Co-marketing:** Manufacturer logo on Sherpa Hub signage, featured in Sherpa app "Recommended Tools" section, email blasts to pro network

**Ask from manufacturer:** $3,000/event sponsorship fee + consignment inventory (5-10 units for rental fleet at 40% off retail, Sherpa maintains and insures).

---

## 7. Expansion Roadmap

| Phase | Timeline | Hubs | Market | Investment |
|-------|----------|------|--------|------------|
| 1 -- Proof | Q3 2026 | 1 (Portsmouth NH) | Seacoast NH | $100K (lease + inventory + buildout) |
| 2 -- Validate | Q1 2027 | 3 (+ Manchester NH, Portland ME) | Southern NH + Southern ME | $250K |
| 3 -- Regional | Q3 2027 | 5 (+ Boston metro, Providence) | Full New England | $500K |
| 4 -- Scale | 2028 | 10-20 (franchise model) | Northeast corridor | Series A territory |

**Hub 1 success metrics (6 months):** 150+ kit orders/mo, 60% tool utilization, 8+ training events, 200 registered pros, $30K+/mo net revenue.

---

## 8. Software Features to Build

### Phase 1 (MVP with Hub 1 launch)
1. `hub_inventory` CRUD + barcode scan (mobile camera)
2. Kit catalog page in pro dashboard (browse, order, pay via Stripe)
3. Equipment rental checkout flow (date picker, deposit hold, Stripe)
4. Training calendar page with registration
5. Hub manager admin panel (inventory counts, rental status, reorders)
6. Push notifications: kit ready, rental due, training reminder

### Phase 2 (Post-launch optimization)
7. Auto-reorder triggers (inventory below threshold -> supplier PO)
8. Delivery dispatch (integrate existing gig delivery from materials API)
9. Damage assessment workflow (photo upload on return, deposit claim)
10. Manufacturer portal (view rental stats, training attendance, schedule events)
11. Kit builder: pro customizes a kit from Assembly Wiseman data
12. Demand forecasting: pipeline jobs -> predicted kit demand

### Phase 3 (Multi-hub)
13. Inter-hub transfer (tool at Hub A needed at Hub B)
14. Hub-level P&L dashboard
15. Franchise management (onboard new hub operators)
16. Loyalty program (rent 10x -> free day, buy 20 kits -> tier upgrade)

---

## Integration with Existing Platform

- **Existing `hubs` table** already has geography, radius, config JSONB -- extend `config` with hub_type: 'digital' | 'physical' | 'hybrid'
- **Existing materials API** (`/api/materials/order`) uses Zinc/HD -- Hub kits become an alternative fulfillment path: if pro is near a physical hub, offer hub pickup at lower price vs HD delivery
- **Existing Stripe Connect** handles deposits and kit payments through the same marketplace split infrastructure
- **Existing pro_certifications table** receives certs from training events automatically
- **Dispatch Wiseman** factors in hub proximity when scoring pros -- pros near a hub with stocked kits get a dispatch bonus
