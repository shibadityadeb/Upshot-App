-- ============================================================
-- 020 — Campus Cartel: State field
-- ============================================================
-- Adds a state column so applications can record the applicant's state.

ALTER TABLE campus_cartel_members
  ADD COLUMN IF NOT EXISTS state TEXT;
