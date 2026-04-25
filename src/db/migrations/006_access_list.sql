-- Migration 006: Access List table
-- Moves the hardcoded beta access list into the database

CREATE TABLE IF NOT EXISTS access_list (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL DEFAULT '',
  default_role VARCHAR(20) DEFAULT NULL, -- 'pm', 'pro', 'client', 'tenant', or NULL
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'revoked'
  invited_by VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_access_list_email ON access_list(email);
CREATE INDEX idx_access_list_status ON access_list(status);
