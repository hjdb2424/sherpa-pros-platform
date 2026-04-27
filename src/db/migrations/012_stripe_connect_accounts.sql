-- Migration 012: Stripe Connect Accounts
-- Adds Stripe Connected Account tracking to users table for pro verification.
-- Pro verification gates the ability to receive payouts (Plan 2).

ALTER TABLE users
  ADD COLUMN stripe_account_id VARCHAR(64),
  ADD COLUMN stripe_account_status VARCHAR(20) NOT NULL DEFAULT 'none',
  ADD COLUMN stripe_onboarded_at TIMESTAMPTZ;

CREATE INDEX idx_users_stripe_account_id ON users(stripe_account_id);

CREATE INDEX idx_users_stripe_status_pro ON users(stripe_account_status)
  WHERE role = 'pro';

COMMENT ON COLUMN users.stripe_account_status IS
  'Stripe Connected Account state: none | pending | active | restricted | disabled';
