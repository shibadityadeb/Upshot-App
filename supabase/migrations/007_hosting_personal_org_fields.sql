-- Add personal details, organisation details, and event location fields to hosting_applications

ALTER TABLE hosting_applications
  ADD COLUMN applicant_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN applicant_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN applicant_email TEXT NOT NULL DEFAULT '',
  ADD COLUMN event_type TEXT NOT NULL DEFAULT 'personal' CHECK (event_type IN ('organisation', 'personal')),
  ADD COLUMN org_legal_name TEXT,
  ADD COLUMN org_city TEXT,
  ADD COLUMN org_state TEXT,
  ADD COLUMN org_sector TEXT,
  ADD COLUMN org_designation TEXT,
  ADD COLUMN event_city TEXT NOT NULL DEFAULT '',
  ADD COLUMN event_state TEXT NOT NULL DEFAULT '',
  ADD COLUMN fees INTEGER;
