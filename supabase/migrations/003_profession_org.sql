-- Migration 003: Add profession, organisation_name, city, state to students table

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS organisation_name TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT;

-- Allow students to update their own record
DO $$ BEGIN
  CREATE POLICY students_update ON students FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
