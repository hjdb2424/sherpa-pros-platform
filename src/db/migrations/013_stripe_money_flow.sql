-- Migration 013: Stripe Connect Money Flow Foundations
-- - Adds stripe_transfer_id to payments (used by Plan 2b's release path)
-- - Creates stripe_events_processed for webhook idempotency
-- - Adds partial unique index for pending-payment idempotency

ALTER TABLE payments
  ADD COLUMN stripe_transfer_id VARCHAR(64);
-- Note: no index on stripe_transfer_id. The column is NULL for all Plan 2a rows
-- (B-tree indexes don't index NULLs by default), and Plan 2b will query by
-- payment_id or stripe_payment_intent_id, not transfer_id. Add an index when
-- a real query pattern emerges.

CREATE TABLE stripe_events_processed (
  event_id VARCHAR(64) PRIMARY KEY,
  event_type VARCHAR(128) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- event_type is VARCHAR(128) rather than 60 because Stripe's event-type
-- namespace has grown over time (e.g., financial_connections.account.refreshed
-- is 46 chars) and there is no published cap. 128 leaves headroom for future
-- API versions without changing storage cost meaningfully on Postgres.
-- No additional indexes — PK covers the only operation (dedupe by event_id).

-- Partial unique index: prevents two concurrent fund attempts on the same
-- (job, milestone, payer) triple from both creating PaymentIntents.
-- The second INSERT fails with a uniqueness violation; the handler catches
-- it and falls into the reuse-pending path.
CREATE UNIQUE INDEX uq_payments_pending_per_milestone
  ON payments(job_id, milestone_id, payer_user_id)
  WHERE status = 'pending';
