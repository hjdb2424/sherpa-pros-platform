-- Migration 005: Phase 0 traction telemetry
-- Adds the schema surfaces the investor metrics dashboard needs to read live data:
--   1. pros.is_founding_pro       — beta cohort flag (5% take grandfathered forever)
--   2. jobs.matched_at            — denormalized match timestamp for liquidity calc
--   3. hubs.metro_label           — human-readable metro name for dashboards
--   4. nps_responses              — weekly pro + client NPS captures
--   5. wiseman_events             — code-aware platform telemetry (validations, code checks, scope approvals)

BEGIN;

-- 1. pros.is_founding_pro
ALTER TABLE pros
  ADD COLUMN IF NOT EXISTS is_founding_pro BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_pros_is_founding_pro ON pros (is_founding_pro) WHERE is_founding_pro = TRUE;

-- 2. jobs.matched_at
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS matched_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_jobs_matched_at ON jobs (matched_at) WHERE matched_at IS NOT NULL;

-- 3. hubs.metro_label
ALTER TABLE hubs
  ADD COLUMN IF NOT EXISTS metro_label VARCHAR(100);

-- Backfill the four launch-metro labels (per spec §4 — Northern Triangle + Boston specialty).
-- Region codes follow the existing pattern (NE for Northeast).
UPDATE hubs SET metro_label = 'Portsmouth, NH'  WHERE name ILIKE '%portsmouth%' AND metro_label IS NULL;
UPDATE hubs SET metro_label = 'Manchester, NH'  WHERE name ILIKE '%manchester%' AND metro_label IS NULL;
UPDATE hubs SET metro_label = 'Portland, ME'    WHERE name ILIKE '%portland%'   AND metro_label IS NULL;
UPDATE hubs SET metro_label = 'Boston, MA'      WHERE name ILIKE '%boston%'     AND metro_label IS NULL;

-- 4. nps_responses
CREATE TABLE IF NOT EXISTS nps_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(10) NOT NULL CHECK (role IN ('pro', 'client', 'pm')),
  score       INTEGER NOT NULL CHECK (score BETWEEN 0 AND 10),
  comment     TEXT,
  week_of     DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nps_responses_user_id ON nps_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_role    ON nps_responses (role);
CREATE INDEX IF NOT EXISTS idx_nps_responses_week_of ON nps_responses (week_of);

-- 5. wiseman_events
CREATE TABLE IF NOT EXISTS wiseman_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  VARCHAR(25) NOT NULL CHECK (event_type IN (
    'quote_validation',
    'code_check',
    'scope_approval',
    'rebate_lookup',
    'permit_check'
  )),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  job_id      UUID REFERENCES jobs(id)  ON DELETE SET NULL,
  latency_ms  INTEGER,
  payload     JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wiseman_events_event_type ON wiseman_events (event_type);
CREATE INDEX IF NOT EXISTS idx_wiseman_events_user_id    ON wiseman_events (user_id);
CREATE INDEX IF NOT EXISTS idx_wiseman_events_job_id     ON wiseman_events (job_id);
CREATE INDEX IF NOT EXISTS idx_wiseman_events_created_at ON wiseman_events (created_at DESC);

COMMIT;
