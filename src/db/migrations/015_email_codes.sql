-- Migration 015: Email OTP Codes for Beta Auth
--
-- Stores SHA-256 hashes of 6-digit one-time codes mailed to users via the
-- email-OTP flow described in docs/superpowers/specs/2026-05-07-email-otp-auth-design.md
--
-- Lifecycle:
--   1. POST /api/auth/email/request-code generates a code, hashes it,
--      inserts a row with NOW()+10min expiry. Plaintext is sent via Resend.
--   2. POST /api/auth/email/verify-code looks up the active row for the
--      email (consumed_at IS NULL AND expires_at > NOW()), compares hashes,
--      and on match sets consumed_at = NOW(). On mismatch increments
--      attempts; row is treated as locked once attempts >= 5.
--
-- Security:
--   * code_hash is sha256(code) — plaintext never persisted.
--   * Rate limit (5/email/hour) is enforced by counting created_at rows.
--   * Active-code lookups use idx_email_codes_active.
--   * Rate-limit counts use idx_email_codes_rate_limit.
--
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS email_codes (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP,
  attempts    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_codes_active
  ON email_codes(email, consumed_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_email_codes_rate_limit
  ON email_codes(email, created_at);
