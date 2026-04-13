-- =============================================================================
-- Sherpa Pros Platform — Complete Database Schema
-- PostgreSQL 15+ with PostGIS
-- All monetary values stored as INTEGER CENTS
-- All locations stored as GEOGRAPHY(Point, 4326)
-- All primary keys are UUIDs via gen_random_uuid()
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================================================
-- USERS & AUTH
-- =============================================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id        VARCHAR(255) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(10) NOT NULL CHECK (role IN ('pro', 'client')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_clerk_id ON users (clerk_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- =============================================================================
-- HUBS
-- =============================================================================

CREATE TABLE hubs (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    VARCHAR(255) NOT NULL,
    region                  VARCHAR(10) NOT NULL CHECK (region IN ('NH', 'ME', 'MA')),
    center                  GEOGRAPHY(Point, 4326) NOT NULL,
    radius_km               DECIMAL(8,2) NOT NULL CHECK (radius_km > 0),
    dispatch_threshold_cents INTEGER NOT NULL DEFAULT 0,
    is_active               BOOLEAN NOT NULL DEFAULT true,
    config                  JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hubs_region ON hubs (region);
CREATE INDEX idx_hubs_center ON hubs USING GIST (center);
CREATE INDEX idx_hubs_is_active ON hubs (is_active);

-- =============================================================================
-- PRO PROFILES
-- =============================================================================

CREATE TABLE pros (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name            VARCHAR(255) NOT NULL,
    bio                     TEXT,
    home_hub_id             UUID REFERENCES hubs(id) ON DELETE SET NULL,
    travel_radius_km        DECIMAL(8,2) DEFAULT 50.00,
    onboarding_status       VARCHAR(25) NOT NULL DEFAULT 'draft'
                            CHECK (onboarding_status IN (
                                'draft', 'pending_verification', 'active', 'paused', 'archived'
                            )),
    license_number          VARCHAR(100),
    license_state           VARCHAR(5),
    insurance_provider      VARCHAR(255),
    insurance_expiry        DATE,
    insurance_verified      BOOLEAN NOT NULL DEFAULT false,
    background_check_status VARCHAR(20) DEFAULT 'none'
                            CHECK (background_check_status IN (
                                'none', 'pending', 'passed', 'failed'
                            )),
    background_check_date   DATE,
    rating_score            INTEGER DEFAULT 0,
    visibility_score        INTEGER DEFAULT 0,
    badge_tier              VARCHAR(10) DEFAULT 'bronze'
                            CHECK (badge_tier IN ('bronze', 'silver', 'gold')),
    joined_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    location                GEOGRAPHY(Point, 4326),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pros_user_id ON pros (user_id);
CREATE INDEX idx_pros_home_hub_id ON pros (home_hub_id);
CREATE INDEX idx_pros_onboarding_status ON pros (onboarding_status);
CREATE INDEX idx_pros_badge_tier ON pros (badge_tier);
CREATE INDEX idx_pros_location ON pros USING GIST (location);
CREATE INDEX idx_pros_rating_score ON pros (rating_score DESC);
CREATE INDEX idx_pros_visibility_score ON pros (visibility_score DESC);

-- Pro Trades
CREATE TABLE pro_trades (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id          UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    trade_category  VARCHAR(100) NOT NULL,
    specialty       VARCHAR(255),
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    is_primary      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pro_trades_pro_id ON pro_trades (pro_id);
CREATE INDEX idx_pro_trades_category ON pro_trades (trade_category);

-- Pro Certifications
CREATE TABLE pro_certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id          UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    cert_type       VARCHAR(100) NOT NULL,
    cert_number     VARCHAR(100),
    issuer          VARCHAR(255) NOT NULL,
    issued_date     DATE NOT NULL,
    expiry_date     DATE,
    verified        BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pro_certifications_pro_id ON pro_certifications (pro_id);
CREATE INDEX idx_pro_certifications_expiry ON pro_certifications (expiry_date);

-- Pro Portfolio
CREATE TABLE pro_portfolio (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id          UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    photos          JSONB DEFAULT '[]',
    project_value   INTEGER, -- cents
    category        VARCHAR(100),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pro_portfolio_pro_id ON pro_portfolio (pro_id);
CREATE INDEX idx_pro_portfolio_category ON pro_portfolio (category);

-- Pro Availability
CREATE TABLE pro_availability (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id              UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    date                DATE,
    status              VARCHAR(15) NOT NULL DEFAULT 'available'
                        CHECK (status IN ('available', 'booked', 'blocked')),
    recurring_day_of_week INTEGER CHECK (recurring_day_of_week IS NULL OR (recurring_day_of_week >= 0 AND recurring_day_of_week <= 6)),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pro_availability_pro_id ON pro_availability (pro_id);
CREATE INDEX idx_pro_availability_date ON pro_availability (date);
CREATE INDEX idx_pro_availability_status ON pro_availability (status);

-- =============================================================================
-- HUB-PRO JUNCTION
-- =============================================================================

CREATE TABLE hub_pros (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id      UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
    pro_id      UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    is_home_hub BOOLEAN NOT NULL DEFAULT false,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (hub_id, pro_id)
);

CREATE INDEX idx_hub_pros_hub_id ON hub_pros (hub_id);
CREATE INDEX idx_hub_pros_pro_id ON hub_pros (pro_id);

-- =============================================================================
-- JOBS
-- =============================================================================

CREATE TABLE jobs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    category            VARCHAR(100),
    urgency             VARCHAR(15) NOT NULL DEFAULT 'standard'
                        CHECK (urgency IN ('emergency', 'standard', 'flexible')),
    budget_min_cents    INTEGER CHECK (budget_min_cents >= 0),
    budget_max_cents    INTEGER CHECK (budget_max_cents >= 0),
    location            GEOGRAPHY(Point, 4326),
    address             TEXT,
    hub_id              UUID REFERENCES hubs(id) ON DELETE SET NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN (
                            'draft', 'posted', 'accepting_bids', 'dispatching',
                            'assigned', 'in_progress', 'completed', 'reviewed',
                            'closed', 'cancelled'
                        )),
    dispatch_type       VARCHAR(10) DEFAULT 'bid'
                        CHECK (dispatch_type IN ('auto', 'bid')),
    permit_required     BOOLEAN NOT NULL DEFAULT false,
    permit_details      JSONB DEFAULT '{}',
    wiseman_validation  JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_budget_range CHECK (
        budget_min_cents IS NULL OR budget_max_cents IS NULL OR budget_min_cents <= budget_max_cents
    )
);

CREATE INDEX idx_jobs_client_user_id ON jobs (client_user_id);
CREATE INDEX idx_jobs_hub_id ON jobs (hub_id);
CREATE INDEX idx_jobs_status ON jobs (status);
CREATE INDEX idx_jobs_urgency ON jobs (urgency);
CREATE INDEX idx_jobs_category ON jobs (category);
CREATE INDEX idx_jobs_location ON jobs USING GIST (location);
CREATE INDEX idx_jobs_created_at ON jobs (created_at DESC);

-- Job Milestones
CREATE TABLE job_milestones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    amount_cents    INTEGER NOT NULL CHECK (amount_cents >= 0),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(15) NOT NULL DEFAULT 'pending'
                    CHECK (status IN (
                        'pending', 'funded', 'in_progress', 'completed', 'released'
                    )),
    funded_at       TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    released_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_milestones_job_id ON job_milestones (job_id);
CREATE INDEX idx_job_milestones_status ON job_milestones (status);

-- Job Photos
CREATE TABLE job_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    milestone_id    UUID REFERENCES job_milestones(id) ON DELETE SET NULL,
    phase           VARCHAR(10) NOT NULL CHECK (phase IN ('before', 'during', 'after')),
    url             TEXT NOT NULL,
    caption         VARCHAR(500),
    uploaded_by     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_photos_job_id ON job_photos (job_id);
CREATE INDEX idx_job_photos_milestone_id ON job_photos (milestone_id);
CREATE INDEX idx_job_photos_phase ON job_photos (phase);

-- =============================================================================
-- BIDDING & DISPATCH
-- =============================================================================

CREATE TABLE bids (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id                  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    pro_id                  UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    amount_cents            INTEGER NOT NULL CHECK (amount_cents > 0),
    message                 TEXT,
    estimated_duration_days INTEGER CHECK (estimated_duration_days > 0),
    wiseman_deviation_pct   DECIMAL(5,2),
    status                  VARCHAR(15) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, pro_id)
);

CREATE INDEX idx_bids_job_id ON bids (job_id);
CREATE INDEX idx_bids_pro_id ON bids (pro_id);
CREATE INDEX idx_bids_status ON bids (status);

CREATE TABLE dispatch_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    pro_id          UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    dispatch_score  DECIMAL(8,4),
    notified_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at    TIMESTAMPTZ,
    response        VARCHAR(10) CHECK (response IN ('accepted', 'declined', 'expired')),
    attempt_order   INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispatch_attempts_job_id ON dispatch_attempts (job_id);
CREATE INDEX idx_dispatch_attempts_pro_id ON dispatch_attempts (pro_id);
CREATE INDEX idx_dispatch_attempts_response ON dispatch_attempts (response);

-- =============================================================================
-- RATINGS & TRUST
-- =============================================================================

CREATE TABLE ratings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    from_user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score   INTEGER NOT NULL CHECK (overall_score >= 1 AND overall_score <= 5),
    quality         INTEGER CHECK (quality >= 1 AND quality <= 5),
    communication   INTEGER CHECK (communication >= 1 AND communication <= 5),
    timeliness      INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
    value           INTEGER CHECK (value >= 1 AND value <= 5),
    review_text     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, from_user_id)
);

CREATE INDEX idx_ratings_job_id ON ratings (job_id);
CREATE INDEX idx_ratings_from_user_id ON ratings (from_user_id);
CREATE INDEX idx_ratings_to_user_id ON ratings (to_user_id);
CREATE INDEX idx_ratings_overall_score ON ratings (overall_score);

CREATE TABLE rating_responses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating_id       UUID NOT NULL UNIQUE REFERENCES ratings(id) ON DELETE CASCADE,
    responder_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body            TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rating_responses_rating_id ON rating_responses (rating_id);
CREATE INDEX idx_rating_responses_responder_id ON rating_responses (responder_id);

CREATE TABLE strikes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_id      UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
    reason      TEXT NOT NULL,
    severity    VARCHAR(10) NOT NULL CHECK (severity IN ('warning', 'minor', 'major', 'critical')),
    issued_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    notes       TEXT
);

CREATE INDEX idx_strikes_pro_id ON strikes (pro_id);
CREATE INDEX idx_strikes_severity ON strikes (severity);

-- =============================================================================
-- PAYMENTS
-- =============================================================================

CREATE TABLE payments (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id                      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    milestone_id                UUID REFERENCES job_milestones(id) ON DELETE SET NULL,
    payer_user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payee_user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_cents                INTEGER NOT NULL CHECK (amount_cents > 0),
    commission_cents            INTEGER NOT NULL DEFAULT 0 CHECK (commission_cents >= 0),
    service_fee_cents           INTEGER NOT NULL DEFAULT 0 CHECK (service_fee_cents >= 0),
    stripe_payment_intent_id    VARCHAR(255),
    status                      VARCHAR(15) NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'held', 'released', 'refunded', 'disputed')),
    held_at                     TIMESTAMPTZ,
    released_at                 TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_job_id ON payments (job_id);
CREATE INDEX idx_payments_milestone_id ON payments (milestone_id);
CREATE INDEX idx_payments_payer_user_id ON payments (payer_user_id);
CREATE INDEX idx_payments_payee_user_id ON payments (payee_user_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_stripe_pi ON payments (stripe_payment_intent_id);

CREATE TABLE payment_disputes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id  UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    raised_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason      TEXT NOT NULL,
    evidence    JSONB DEFAULT '{}',
    status      VARCHAR(15) NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'mediation', 'escalated', 'resolved')),
    resolution  TEXT,
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_disputes_payment_id ON payment_disputes (payment_id);
CREATE INDEX idx_payment_disputes_raised_by ON payment_disputes (raised_by);
CREATE INDEX idx_payment_disputes_status ON payment_disputes (status);

-- =============================================================================
-- COMMUNICATION
-- =============================================================================

CREATE TABLE conversations (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id                  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    pro_user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    twilio_conversation_sid VARCHAR(255),
    status                  VARCHAR(10) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'closed')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at               TIMESTAMPTZ,
    UNIQUE (job_id, pro_user_id, client_user_id)
);

CREATE INDEX idx_conversations_job_id ON conversations (job_id);
CREATE INDEX idx_conversations_pro_user_id ON conversations (pro_user_id);
CREATE INDEX idx_conversations_client_user_id ON conversations (client_user_id);
CREATE INDEX idx_conversations_status ON conversations (status);

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body                TEXT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX idx_messages_sender_user_id ON messages (sender_user_id);
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);

-- =============================================================================
-- CHECKLISTS
-- =============================================================================

CREATE TABLE job_checklists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    type            VARCHAR(15) NOT NULL CHECK (type IN ('onboarding', 'offboarding')),
    items           JSONB NOT NULL DEFAULT '[]',
    completed_at    TIMESTAMPTZ,
    required        BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_checklists_job_id ON job_checklists (job_id);
CREATE INDEX idx_job_checklists_type ON job_checklists (type);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at columns
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hubs FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON pros FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON pro_portfolio FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON job_milestones FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON rating_responses FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payment_disputes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON job_checklists FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
