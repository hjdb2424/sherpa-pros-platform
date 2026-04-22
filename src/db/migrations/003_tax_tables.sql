-- Migration 003: Tax Compliance Module
-- W-9 collection, 1099-NEC tracking, expenses, mileage, quarterly estimates, year-end packages

BEGIN;

-- ---------------------------------------------------------------------------
-- W-9 PROFILES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_w9_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  legal_name    TEXT NOT NULL,
  business_name TEXT,
  entity_type   VARCHAR(30) NOT NULL
    CHECK (entity_type IN ('sole_proprietor','llc_single','llc_multi','c_corp','s_corp','partnership','trust')),
  tin_last_four VARCHAR(4) NOT NULL CHECK (length(tin_last_four) = 4),
  tin_encrypted TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  state         VARCHAR(2) NOT NULL CHECK (length(state) = 2),
  zip           VARCHAR(10) NOT NULL,
  tin_verified  BOOLEAN NOT NULL DEFAULT false,
  tin_verified_at TIMESTAMPTZ,
  status        VARCHAR(15) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','verified','rejected')),
  submitted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_tax_w9_profiles_pro_id ON tax_w9_profiles(pro_id);
CREATE INDEX idx_tax_w9_profiles_status ON tax_w9_profiles(status);
CREATE INDEX idx_tax_w9_profiles_entity_type ON tax_w9_profiles(entity_type);

-- ---------------------------------------------------------------------------
-- 1099-NEC RECORDS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_1099_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_year        INTEGER NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2099),
  total_cents     INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  threshold_met   BOOLEAN NOT NULL DEFAULT false,
  status          VARCHAR(15) NOT NULL DEFAULT 'tracking'
    CHECK (status IN ('tracking','threshold_met','generated','reviewed','filed','corrected')),
  payer_name      TEXT NOT NULL,
  payee_name      TEXT NOT NULL,
  payee_tin_last_four VARCHAR(4),
  generated_at    TIMESTAMPTZ,
  filed_at        TIMESTAMPTZ,
  filing_reference TEXT,
  correction_of_id UUID REFERENCES tax_1099_records(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_tax_1099_payer_payee_year ON tax_1099_records(payer_user_id, payee_user_id, tax_year);
CREATE INDEX idx_tax_1099_payer_user_id ON tax_1099_records(payer_user_id);
CREATE INDEX idx_tax_1099_payee_user_id ON tax_1099_records(payee_user_id);
CREATE INDEX idx_tax_1099_tax_year ON tax_1099_records(tax_year);
CREATE INDEX idx_tax_1099_status ON tax_1099_records(status);
CREATE INDEX idx_tax_1099_threshold_met ON tax_1099_records(threshold_met);

-- ---------------------------------------------------------------------------
-- EXPENSES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_year        INTEGER NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2099),
  category        VARCHAR(30) NOT NULL
    CHECK (category IN ('supplies','commissions','vehicle','insurance','tools','contract_labor','office','rent','repairs','utilities','other')),
  schedule_c_line VARCHAR(10) NOT NULL,
  description     TEXT NOT NULL,
  amount_cents    INTEGER NOT NULL CHECK (amount_cents >= 0),
  source          VARCHAR(15) NOT NULL DEFAULT 'manual'
    CHECK (source IN ('platform','manual','qbo_sync')),
  source_ref_id   TEXT,
  receipt_url     TEXT,
  is_deductible   BOOLEAN NOT NULL DEFAULT true,
  date            DATE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tax_expenses_user_id ON tax_expenses(user_id);
CREATE INDEX idx_tax_expenses_tax_year ON tax_expenses(tax_year);
CREATE INDEX idx_tax_expenses_category ON tax_expenses(category);
CREATE INDEX idx_tax_expenses_date ON tax_expenses(date);
CREATE INDEX idx_tax_expenses_source ON tax_expenses(source);

-- ---------------------------------------------------------------------------
-- MILEAGE LOGS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_mileage_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id              UUID REFERENCES jobs(id) ON DELETE SET NULL,
  date                DATE NOT NULL,
  origin_address      TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  miles               NUMERIC(8,2) NOT NULL CHECK (miles > 0),
  irs_rate_cents      INTEGER NOT NULL DEFAULT 67,
  deduction_cents     INTEGER NOT NULL CHECK (deduction_cents >= 0),
  source              VARCHAR(15) NOT NULL DEFAULT 'manual'
    CHECK (source IN ('gps_auto','manual')),
  is_business         BOOLEAN NOT NULL DEFAULT true,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tax_mileage_pro_id ON tax_mileage_logs(pro_id);
CREATE INDEX idx_tax_mileage_job_id ON tax_mileage_logs(job_id);
CREATE INDEX idx_tax_mileage_date ON tax_mileage_logs(date);
CREATE INDEX idx_tax_mileage_source ON tax_mileage_logs(source);

-- ---------------------------------------------------------------------------
-- QUARTERLY ESTIMATED TAX
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_quarterly_estimates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_year              INTEGER NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2099),
  quarter               INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  ytd_income_cents      INTEGER NOT NULL DEFAULT 0,
  ytd_expenses_cents    INTEGER NOT NULL DEFAULT 0,
  taxable_income_cents  INTEGER NOT NULL DEFAULT 0,
  se_tax_cents          INTEGER NOT NULL DEFAULT 0,
  income_tax_cents      INTEGER NOT NULL DEFAULT 0,
  total_estimated_cents INTEGER NOT NULL DEFAULT 0,
  deadline              DATE NOT NULL,
  reminder_sent         BOOLEAN NOT NULL DEFAULT false,
  payment_made          BOOLEAN NOT NULL DEFAULT false,
  payment_amount_cents  INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_tax_quarterly_pro_year_q ON tax_quarterly_estimates(pro_id, tax_year, quarter);
CREATE INDEX idx_tax_quarterly_pro_id ON tax_quarterly_estimates(pro_id);
CREATE INDEX idx_tax_quarterly_tax_year ON tax_quarterly_estimates(tax_year);
CREATE INDEX idx_tax_quarterly_deadline ON tax_quarterly_estimates(deadline);

-- ---------------------------------------------------------------------------
-- YEAR-END TAX PACKAGES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_year_packages (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_year                    INTEGER NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2099),
  role                        VARCHAR(10) NOT NULL CHECK (role IN ('pro','client','pm')),
  total_income_cents          INTEGER NOT NULL DEFAULT 0,
  total_expenses_cents        INTEGER NOT NULL DEFAULT 0,
  total_mileage_deduction_cents INTEGER NOT NULL DEFAULT 0,
  total_1099s_issued          INTEGER NOT NULL DEFAULT 0,
  total_1099s_received        INTEGER NOT NULL DEFAULT 0,
  package_data                JSONB DEFAULT '{}',
  pdf_url                     TEXT,
  exported_to                 VARCHAR(15)
    CHECK (exported_to IS NULL OR exported_to IN ('turbotax','qbo','cpa')),
  generated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_tax_year_pkg_user_year_role ON tax_year_packages(user_id, tax_year, role);
CREATE INDEX idx_tax_year_packages_user_id ON tax_year_packages(user_id);
CREATE INDEX idx_tax_year_packages_tax_year ON tax_year_packages(tax_year);

COMMIT;
