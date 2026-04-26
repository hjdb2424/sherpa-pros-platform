-- Migration 009: Multi-Trade Jobs
-- Enables parent/child job relationships for multi-trade projects.

ALTER TABLE jobs ADD COLUMN parent_job_id UUID REFERENCES jobs(id);
ALTER TABLE jobs ADD COLUMN sequence_order INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN trade_required VARCHAR(60);
CREATE INDEX idx_jobs_parent ON jobs(parent_job_id);
