-- ============================================================================
-- Migration 002: PM (Property Management) Tier Tables
-- Adds property-centric tables for commercial/PM accounts:
--   properties, units, work_orders, preferred_vendors,
--   maintenance_schedules, make_readies, compliance_items
-- ============================================================================

-- Ensure PostGIS extension exists (idempotent)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------------------
-- PROPERTIES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pm_user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  property_type VARCHAR(30) NOT NULL
    CHECK (property_type IN ('multi_family','commercial','mixed_use','hoa','vacation_rental','senior_living')),
  unit_count    INTEGER NOT NULL DEFAULT 0 CHECK (unit_count >= 0),
  total_sqft    INTEGER CHECK (total_sqft >= 0),
  year_built    INTEGER CHECK (year_built >= 1800 AND year_built <= 2100),
  monthly_budget_cents  INTEGER CHECK (monthly_budget_cents >= 0),
  reserve_fund_cents    INTEGER CHECK (reserve_fund_cents >= 0),
  location      GEOGRAPHY(Point, 4326),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_pm_user_id     ON properties(pm_user_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type  ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city_state     ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_location       ON properties USING GIST(location);

-- ---------------------------------------------------------------------------
-- UNITS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS units (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number       TEXT NOT NULL,
  sqft              INTEGER CHECK (sqft >= 0),
  bedrooms          INTEGER CHECK (bedrooms >= 0),
  bathrooms         NUMERIC(3,1) CHECK (bathrooms >= 0),
  status            VARCHAR(15) NOT NULL DEFAULT 'vacant'
    CHECK (status IN ('occupied','vacant','make_ready','offline')),
  tenant_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  monthly_rent_cents INTEGER CHECK (monthly_rent_cents >= 0),
  lease_start       DATE,
  lease_end         DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_units_property_id    ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status         ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_tenant_user_id ON units(tenant_user_id);

-- ---------------------------------------------------------------------------
-- WORK ORDERS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS work_orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id      UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_id          UUID REFERENCES units(id) ON DELETE SET NULL,
  pm_user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_pro_id  UUID,  -- soft FK to pros table
  title            TEXT NOT NULL,
  description      TEXT,
  category         VARCHAR(100),
  priority         VARCHAR(15) NOT NULL DEFAULT 'routine'
    CHECK (priority IN ('routine','urgent','emergency')),
  status           VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','approved','dispatched','in_progress','completed','invoiced','closed')),
  sla_hours        INTEGER CHECK (sla_hours >= 0),
  budget_cents     INTEGER CHECK (budget_cents >= 0),
  actual_cost_cents INTEGER CHECK (actual_cost_cents >= 0),
  expense_type     VARCHAR(10)
    CHECK (expense_type IN ('opex','capex')),
  po_number        VARCHAR(50),
  submitted_by     VARCHAR(10) NOT NULL DEFAULT 'pm'
    CHECK (submitted_by IN ('tenant','pm','auto')),
  photos           JSONB DEFAULT '[]'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  dispatched_at    TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_orders_property_id      ON work_orders(property_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_unit_id          ON work_orders(unit_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_pm_user_id       ON work_orders(pm_user_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned_pro_id  ON work_orders(assigned_pro_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status           ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_priority         ON work_orders(priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_category         ON work_orders(category);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at       ON work_orders(created_at);

-- ---------------------------------------------------------------------------
-- PREFERRED VENDORS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS preferred_vendors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pm_user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pro_id                UUID NOT NULL,  -- soft FK to pros table
  trade_category        VARCHAR(100) NOT NULL,
  negotiated_rate_cents INTEGER CHECK (negotiated_rate_cents >= 0),
  priority_rank         INTEGER NOT NULL DEFAULT 1 CHECK (priority_rank >= 1),
  insurance_verified    BOOLEAN NOT NULL DEFAULT false,
  insurance_expiry      DATE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_preferred_vendors_pm_user_id      ON preferred_vendors(pm_user_id);
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_pro_id          ON preferred_vendors(pro_id);
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_trade_category  ON preferred_vendors(trade_category);

-- ---------------------------------------------------------------------------
-- MAINTENANCE SCHEDULES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id          UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_id              UUID REFERENCES units(id) ON DELETE SET NULL,
  title                TEXT NOT NULL,
  description          TEXT,
  category             VARCHAR(100),
  frequency            VARCHAR(20) NOT NULL
    CHECK (frequency IN ('monthly','quarterly','semi_annual','annual')),
  next_due             DATE NOT NULL,
  last_completed       DATE,
  estimated_cost_cents INTEGER CHECK (estimated_cost_cents >= 0),
  preferred_vendor_id  UUID REFERENCES preferred_vendors(id) ON DELETE SET NULL,
  auto_dispatch        BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_property_id ON maintenance_schedules(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_next_due    ON maintenance_schedules(next_due);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_frequency   ON maintenance_schedules(frequency);

-- ---------------------------------------------------------------------------
-- MAKE-READIES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS make_readies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id           UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  property_id       UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  vacate_date       DATE NOT NULL,
  target_ready_date DATE NOT NULL,
  actual_ready_date DATE,
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','punch_list','final_inspection','ready','listed')),
  punch_list        JSONB DEFAULT '[]'::jsonb,
  total_cost_cents  INTEGER CHECK (total_cost_cents >= 0),
  work_order_ids    JSONB DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_make_readies_unit_id           ON make_readies(unit_id);
CREATE INDEX IF NOT EXISTS idx_make_readies_property_id       ON make_readies(property_id);
CREATE INDEX IF NOT EXISTS idx_make_readies_status            ON make_readies(status);
CREATE INDEX IF NOT EXISTS idx_make_readies_target_ready_date ON make_readies(target_ready_date);

-- ---------------------------------------------------------------------------
-- COMPLIANCE ITEMS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compliance_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  item_type       VARCHAR(50) NOT NULL
    CHECK (item_type IN ('fire_extinguisher','boiler_inspection','lead_paint','elevator','backflow','fire_alarm')),
  description     TEXT,
  due_date        DATE NOT NULL,
  completed_date  DATE,
  status          VARCHAR(15) NOT NULL DEFAULT 'current'
    CHECK (status IN ('current','due_soon','overdue','completed')),
  certificate_url TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_items_property_id ON compliance_items(property_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_item_type   ON compliance_items(item_type);
CREATE INDEX IF NOT EXISTS idx_compliance_items_status      ON compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_compliance_items_due_date    ON compliance_items(due_date);
