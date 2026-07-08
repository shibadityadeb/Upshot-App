-- ============================================================
-- 012 — Campus Cartel: Application / Approval Flow
-- ============================================================
-- Adds a status column so joining requires admin approval.

ALTER TABLE campus_cartel_members
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Back-fill any existing rows as approved (they joined before this change)
UPDATE campus_cartel_members SET status = 'approved' WHERE is_active = TRUE;
UPDATE campus_cartel_members SET status = 'rejected' WHERE is_active = FALSE;

-- Index for quick admin queries
CREATE INDEX IF NOT EXISTS idx_ccm_status ON campus_cartel_members(status);
