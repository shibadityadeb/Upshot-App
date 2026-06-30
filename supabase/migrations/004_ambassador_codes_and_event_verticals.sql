-- Migration 004: Ambassador code generator + event vertical assignment

-- Add fields to ambassadors table
ALTER TABLE ambassadors
  ADD COLUMN IF NOT EXISTS code_type TEXT NOT NULL DEFAULT 'random'
    CHECK (code_type IN ('random', 'custom')),
  ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Standalone ambassador codes table (codes can exist before being claimed)
CREATE TABLE IF NOT EXISTS ambassador_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL DEFAULT 'random'
    CHECK (code_type IN ('random', 'custom')),
  vertical_id UUID REFERENCES verticals(id),
  assigned_to UUID REFERENCES profiles(id),
  is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  issued_by UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ
);

ALTER TABLE ambassador_codes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "ambassador_codes_select_all" ON ambassador_codes
    FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "ambassador_codes_admin_manage" ON ambassador_codes
    FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_ambassador_codes_code ON ambassador_codes(code);
CREATE INDEX IF NOT EXISTS idx_ambassador_codes_claimed ON ambassador_codes(is_claimed);

-- Random code generator: UBM-XXXX-XXXX format
CREATE OR REPLACE FUNCTION generate_random_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    IF i = 4 THEN result := result || '-'; END IF;
  END LOOP;
  RETURN 'UBM-' || result;
END;
$$ LANGUAGE plpgsql;

-- Validate a code
CREATE OR REPLACE FUNCTION validate_ambassador_code(input_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM ambassador_codes
    WHERE code = UPPER(input_code) AND is_active = TRUE AND is_claimed = FALSE
  );
END;
$$ LANGUAGE plpgsql;

-- Add vertical assignment tracking to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS vertical_assigned_at TIMESTAMPTZ;
