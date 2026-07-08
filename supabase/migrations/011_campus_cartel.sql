-- ============================================================
-- 011 — Campus Cartel Members + Leaderboard View
-- ============================================================

-- ─── campus_cartel_members table ────────────────────────────

CREATE TABLE IF NOT EXISTS campus_cartel_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  ambassador_code TEXT,
  college         TEXT,
  course          TEXT,
  year_of_study   INT,
  city            TEXT,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_ccm_user_id ON campus_cartel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_ccm_ambassador_code ON campus_cartel_members(ambassador_code);

-- ─── RLS ────────────────────────────────────────────────────

ALTER TABLE campus_cartel_members ENABLE ROW LEVEL SECURITY;

-- User sees own row
CREATE POLICY ccm_select_own ON campus_cartel_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Ambassador sees their referrals
CREATE POLICY ccm_select_ambassador ON campus_cartel_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ambassadors
      WHERE ambassadors.user_id = auth.uid()
        AND ambassadors.referral_code = campus_cartel_members.ambassador_code
    )
  );

-- User can join (insert own row)
CREATE POLICY ccm_insert ON campus_cartel_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin can update
CREATE POLICY ccm_update ON campus_cartel_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Leaderboard view ──────────────────────────────────────

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id          AS user_id,
  p.full_name,
  p.avatar_url,
  p.role,
  wb.total_earned,
  wb.current_balance,
  s.college,
  a.referral_code   AS ambassador_code,
  a.tier            AS ambassador_tier,
  ROW_NUMBER() OVER (ORDER BY wb.total_earned DESC) AS rank
FROM profiles p
JOIN wallet_balances wb ON wb.user_id = p.id
LEFT JOIN students s    ON s.user_id  = p.id
LEFT JOIN ambassadors a ON a.user_id  = p.id
WHERE p.role IN ('student', 'ambassador', 'people')
  AND wb.total_earned > 0
ORDER BY wb.total_earned DESC;

-- Allow leaderboard reads for authenticated users
-- (views inherit RLS from underlying tables, but we make wallet_balances
--  readable for the leaderboard context)
CREATE POLICY wallet_balances_select_leaderboard ON wallet_balances
  FOR SELECT USING (true);
