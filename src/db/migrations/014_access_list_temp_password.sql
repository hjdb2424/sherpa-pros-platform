-- Migration 014: Temp Password with Expiry for Beta Testers
--
-- Adds three columns to access_list to support admin-generated temporary
-- passwords that auto-expire after a fixed window (default 5 days). The
-- plaintext password is set on Clerk's side via clerkClient.users.updateUser
-- and is NEVER stored in our DB — we only persist the issued/expires
-- timestamps and a flag indicating whether the user has changed it.
--
-- Behavior:
--   * temp_password_set_at      -- when admin generated the temp pw (NULL = never)
--   * temp_password_expires_at  -- NOW() + 5 days at issue time
--   * password_changed          -- flips false on issue, flips true once user changes it
--
-- Existing rows default to password_changed = TRUE so they OPT OUT of
-- enforcement; only NEW temp passwords flip the flag false. The proxy
-- check redirects to /account/change-password ONLY when:
--     password_changed = false AND NOW() > temp_password_expires_at

ALTER TABLE access_list
  ADD COLUMN IF NOT EXISTS temp_password_set_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS temp_password_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_changed         BOOLEAN NOT NULL DEFAULT TRUE;

-- Index supports the proxy's per-request lookup by email + expiry check.
CREATE INDEX IF NOT EXISTS idx_access_list_temp_pw_expiry
  ON access_list(email)
  WHERE password_changed = FALSE;
