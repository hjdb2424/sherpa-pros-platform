-- Migration 007: Subtypes, Pro Skills, and Verification
-- Adds user subtypes, admin flag, pro skill junction, work photos,
-- references for verification, and verification status on pros.

-- Add subtype to users
ALTER TABLE users ADD COLUMN subtype VARCHAR(20);

-- Add is_admin flag
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Add subtype to access_list
ALTER TABLE access_list ADD COLUMN subtype VARCHAR(20);

-- Pro skills junction
CREATE TABLE pro_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
  skill_key VARCHAR(60) NOT NULL,
  skill_category VARCHAR(40) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(pro_id, skill_key)
);
CREATE INDEX idx_pro_skills_pro ON pro_skills(pro_id);
CREATE INDEX idx_pro_skills_key ON pro_skills(skill_key);

-- Pro work photos for verification
CREATE TABLE pro_work_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Pro references for verification
CREATE TABLE pro_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pros(id) ON DELETE CASCADE,
  ref_name VARCHAR(100) NOT NULL,
  ref_phone VARCHAR(20) NOT NULL,
  ref_relationship VARCHAR(60),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Verification status on pros table
ALTER TABLE pros ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE pros ADD COLUMN verification_reviewed_at TIMESTAMPTZ;
ALTER TABLE pros ADD COLUMN verification_notes TEXT;
