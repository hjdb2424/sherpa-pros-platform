-- ============================================================================
-- Migration 004: Performance Indexes for Sherpa Pros Platform
-- ============================================================================
-- Adds missing composite indexes, spatial GiST indexes, and partial indexes
-- to support common query patterns at scale (10K-100K users).
--
-- Covers: users, jobs, bids, pros, reviews/ratings, work_orders, properties,
--         units, compliance_items, messages, payments, tax tables,
--         dispatch_attempts, maintenance_schedules, make_readies
--
-- Estimated total index overhead at 100K users: ~180-250 MB
-- ============================================================================

BEGIN;

-- ============================================================================
-- USERS — clerk_id, email already indexed via UNIQUE + migration 001
-- Add: role-filtered created_at for admin dashboards
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role_created
  ON users (role, created_at DESC);

-- ============================================================================
-- JOBS — Critical: composite indexes for marketplace queries
-- ============================================================================

-- "Recent open jobs" — the #1 query on the platform
-- Covers: WHERE status IN (...) ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_jobs_status_created
  ON jobs (status, created_at DESC);

-- "Jobs by category in a hub" — client/pro browsing
CREATE INDEX IF NOT EXISTS idx_jobs_category_status
  ON jobs (category, status);

-- "Active jobs for a client" — client dashboard
CREATE INDEX IF NOT EXISTS idx_jobs_client_status
  ON jobs (client_user_id, status);

-- "Hub dispatcher queue" — dispatch engine
CREATE INDEX IF NOT EXISTS idx_jobs_hub_status
  ON jobs (hub_id, status) WHERE hub_id IS NOT NULL;

-- Spatial: GiST index on jobs.location
-- 001_initial.sql already creates idx_jobs_location USING GIST
-- Drizzle schema does NOT declare GiST — verify it exists at runtime
-- This is a safety net (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_jobs_location_gist
  ON jobs USING GIST (location) WHERE location IS NOT NULL;

-- ============================================================================
-- BIDS — composite indexes for pro dashboard + job detail
-- ============================================================================

-- "My pending bids" — pro dashboard primary view
CREATE INDEX IF NOT EXISTS idx_bids_pro_status
  ON bids (pro_id, status);

-- "All bids on a job, newest first" — job detail page
CREATE INDEX IF NOT EXISTS idx_bids_job_created
  ON bids (job_id, created_at DESC);

-- "Accepted bids" — for payment/milestone flow
CREATE INDEX IF NOT EXISTS idx_bids_status_created
  ON bids (status, created_at DESC);

-- ============================================================================
-- PROS — composite indexes for marketplace search + dispatch
-- ============================================================================

-- "Active pros by badge tier" — marketplace leaderboard
CREATE INDEX IF NOT EXISTS idx_pros_active_badge
  ON pros (badge_tier, rating_score DESC)
  WHERE onboarding_status = 'active';

-- "Active pros by hub" — hub-scoped dispatch
CREATE INDEX IF NOT EXISTS idx_pros_hub_active
  ON pros (home_hub_id, onboarding_status)
  WHERE home_hub_id IS NOT NULL;

-- Spatial: GiST index on pros.location
-- 001_initial.sql creates idx_pros_location USING GIST — safety net
CREATE INDEX IF NOT EXISTS idx_pros_location_gist
  ON pros USING GIST (location) WHERE location IS NOT NULL;

-- "Pro search by display name" — text search with pg_trgm
-- Requires: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Uncomment when pg_trgm is available on Neon:
-- CREATE INDEX IF NOT EXISTS idx_pros_display_name_trgm
--   ON pros USING gin (display_name gin_trgm_ops);

-- ============================================================================
-- PRO TRADES — composite for join queries
-- ============================================================================

-- "Find pros by trade (with pro details)" — marketplace filter
CREATE INDEX IF NOT EXISTS idx_pro_trades_category_pro
  ON pro_trades (trade_category, pro_id);

-- ============================================================================
-- PRO AVAILABILITY — composite for scheduling queries
-- ============================================================================

-- "Pro's availability on a date" — dispatch engine
CREATE INDEX IF NOT EXISTS idx_pro_availability_pro_date
  ON pro_availability (pro_id, date);

-- ============================================================================
-- RATINGS — composite indexes for review pages
-- ============================================================================

-- "Reviews about a pro, newest first" — pro profile page
CREATE INDEX IF NOT EXISTS idx_ratings_to_user_created
  ON ratings (to_user_id, created_at DESC);

-- "Reviews by a client, newest first" — client profile
CREATE INDEX IF NOT EXISTS idx_ratings_from_user_created
  ON ratings (from_user_id, created_at DESC);

-- "High-rated reviews" — showcase / leaderboard
CREATE INDEX IF NOT EXISTS idx_ratings_score_created
  ON ratings (overall_score DESC, created_at DESC);

-- ============================================================================
-- MESSAGES — composite for conversation thread loading
-- ============================================================================

-- "Messages in a conversation, chronological" — the chat view
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON messages (conversation_id, created_at ASC);

-- ============================================================================
-- CONVERSATIONS — composite for user inbox
-- ============================================================================

-- "Active conversations for a pro"
CREATE INDEX IF NOT EXISTS idx_conversations_pro_status
  ON conversations (pro_user_id, status);

-- "Active conversations for a client"
CREATE INDEX IF NOT EXISTS idx_conversations_client_status
  ON conversations (client_user_id, status);

-- ============================================================================
-- PAYMENTS — composite for financial queries
-- ============================================================================

-- "Payments for a job by status" — job detail / escrow view
CREATE INDEX IF NOT EXISTS idx_payments_job_status
  ON payments (job_id, status);

-- "Payee earnings over time" — pro earnings dashboard
CREATE INDEX IF NOT EXISTS idx_payments_payee_created
  ON payments (payee_user_id, created_at DESC);

-- "Payer payment history" — client payment history
CREATE INDEX IF NOT EXISTS idx_payments_payer_created
  ON payments (payer_user_id, created_at DESC);

-- ============================================================================
-- PAYMENT DISPUTES — composite for admin views
-- ============================================================================

-- "Open disputes, newest first" — admin queue
CREATE INDEX IF NOT EXISTS idx_payment_disputes_status_created
  ON payment_disputes (status, created_at DESC);

-- ============================================================================
-- DISPATCH ATTEMPTS — composite for dispatch engine
-- ============================================================================

-- "All attempts for a job, in order" — dispatch status view
CREATE INDEX IF NOT EXISTS idx_dispatch_attempts_job_order
  ON dispatch_attempts (job_id, attempt_order);

-- "Pro's dispatch history" — pro analytics
CREATE INDEX IF NOT EXISTS idx_dispatch_attempts_pro_created
  ON dispatch_attempts (pro_id, created_at DESC);

-- ============================================================================
-- STRIKES — composite for trust system
-- ============================================================================

-- "Active (unresolved) strikes for a pro"
CREATE INDEX IF NOT EXISTS idx_strikes_pro_unresolved
  ON strikes (pro_id, severity)
  WHERE resolved_at IS NULL;

-- ============================================================================
-- WORK ORDERS — composite indexes for PM dashboard
-- ============================================================================

-- "Open work orders for a property" — PM property detail
CREATE INDEX IF NOT EXISTS idx_work_orders_property_status
  ON work_orders (property_id, status);

-- "Work orders by priority + status" — PM triage queue
CREATE INDEX IF NOT EXISTS idx_work_orders_priority_status
  ON work_orders (priority, status, created_at DESC);

-- "PM's work orders by status" — PM dashboard
CREATE INDEX IF NOT EXISTS idx_work_orders_pm_status
  ON work_orders (pm_user_id, status);

-- "Work orders for a unit" — unit detail
CREATE INDEX IF NOT EXISTS idx_work_orders_unit_status
  ON work_orders (unit_id, status) WHERE unit_id IS NOT NULL;

-- ============================================================================
-- PROPERTIES — composite indexes for PM portfolio view
-- ============================================================================

-- "PM's properties by type" — PM dashboard filter
CREATE INDEX IF NOT EXISTS idx_properties_pm_type
  ON properties (pm_user_id, property_type);

-- Spatial: GiST index on properties.location
CREATE INDEX IF NOT EXISTS idx_properties_location_gist
  ON properties USING GIST (location) WHERE location IS NOT NULL;

-- ============================================================================
-- UNITS — composite for occupancy queries
-- ============================================================================

-- "Units by property and status" — property detail view
CREATE INDEX IF NOT EXISTS idx_units_property_status
  ON units (property_id, status);

-- "Lease expiration tracking" — PM reports
CREATE INDEX IF NOT EXISTS idx_units_lease_end
  ON units (lease_end) WHERE lease_end IS NOT NULL;

-- ============================================================================
-- COMPLIANCE ITEMS — composite for compliance dashboard
-- ============================================================================

-- "Upcoming compliance deadlines for a property"
CREATE INDEX IF NOT EXISTS idx_compliance_property_status_due
  ON compliance_items (property_id, status, due_date);

-- "Overdue items across all properties" — PM alerts
CREATE INDEX IF NOT EXISTS idx_compliance_status_due
  ON compliance_items (status, due_date)
  WHERE status IN ('due_soon', 'overdue');

-- ============================================================================
-- MAINTENANCE SCHEDULES — composite for scheduling
-- ============================================================================

-- "Upcoming maintenance for a property"
CREATE INDEX IF NOT EXISTS idx_maintenance_property_next_due
  ON maintenance_schedules (property_id, next_due);

-- "All overdue maintenance (auto-dispatch candidates)"
CREATE INDEX IF NOT EXISTS idx_maintenance_auto_dispatch_due
  ON maintenance_schedules (auto_dispatch, next_due)
  WHERE auto_dispatch = true;

-- ============================================================================
-- MAKE READIES — composite for turnover tracking
-- ============================================================================

-- "Active make-readies for a property"
CREATE INDEX IF NOT EXISTS idx_make_readies_property_status
  ON make_readies (property_id, status);

-- ============================================================================
-- TAX EXPENSES — composite indexes for tax dashboard
-- ============================================================================

-- "My expenses this year by category" — tax summary page
CREATE INDEX IF NOT EXISTS idx_tax_expenses_user_year_category
  ON tax_expenses (user_id, tax_year, category);

-- "Expenses by date range" — tax reporting
CREATE INDEX IF NOT EXISTS idx_tax_expenses_user_year_date
  ON tax_expenses (user_id, tax_year, date);

-- ============================================================================
-- TAX 1099 RECORDS — composite for 1099 management
-- ============================================================================

-- "Who do I owe 1099s to this year" — payer view
CREATE INDEX IF NOT EXISTS idx_tax_1099_payer_year
  ON tax_1099_records (payer_user_id, tax_year);

-- "My received 1099s this year" — payee view
CREATE INDEX IF NOT EXISTS idx_tax_1099_payee_year
  ON tax_1099_records (payee_user_id, tax_year);

-- "Threshold-met records for filing" — year-end processing
CREATE INDEX IF NOT EXISTS idx_tax_1099_year_threshold
  ON tax_1099_records (tax_year, threshold_met)
  WHERE threshold_met = true;

-- ============================================================================
-- TAX MILEAGE LOGS — composite for mileage tracking
-- ============================================================================

-- "My mileage logs by date" — mileage report
CREATE INDEX IF NOT EXISTS idx_tax_mileage_pro_date
  ON tax_mileage_logs (pro_id, date DESC);

-- ============================================================================
-- TAX QUARTERLY ESTIMATES — composite for payment tracking
-- ============================================================================

-- "My upcoming deadlines" — quarterly reminder
CREATE INDEX IF NOT EXISTS idx_tax_quarterly_pro_year
  ON tax_quarterly_estimates (pro_id, tax_year);

-- "Unpaid estimates due soon" — notification trigger
CREATE INDEX IF NOT EXISTS idx_tax_quarterly_unpaid_deadline
  ON tax_quarterly_estimates (deadline)
  WHERE payment_made = false;

-- ============================================================================
-- TAX YEAR PACKAGES — composite for year-end
-- ============================================================================

-- "My tax package for a year" — already covered by unique index
-- No additional composite needed

-- ============================================================================
-- TAX W9 PROFILES — status tracking
-- ============================================================================

-- "Unverified W9s" — admin compliance queue
CREATE INDEX IF NOT EXISTS idx_tax_w9_unverified
  ON tax_w9_profiles (status)
  WHERE status IN ('draft', 'submitted');

-- ============================================================================
-- HUBS — spatial index (safety net for migration 001)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_hubs_center_gist
  ON hubs USING GIST (center);

-- ============================================================================
-- JOB MILESTONES — composite for milestone tracking
-- ============================================================================

-- "Milestones for a job, in order" — already fast with job_id index
-- Adding status composite for "funded milestones awaiting release"
CREATE INDEX IF NOT EXISTS idx_job_milestones_job_status
  ON job_milestones (job_id, status);

-- ============================================================================
-- PREFERRED VENDORS — composite for vendor lookup
-- ============================================================================

-- "PM's vendors by trade" — vendor selection
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_pm_trade
  ON preferred_vendors (pm_user_id, trade_category);

COMMIT;
