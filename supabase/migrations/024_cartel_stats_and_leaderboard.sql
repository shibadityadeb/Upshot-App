-- Community-wide Campus Cartel stats, and a leaderboard that ranks honestly.
--
-- Problem 1 — the header stats were always "1 members / 1 colleges".
-- getStats() counted campus_cartel_members directly, but ccm_select_own limits
-- SELECT to `user_id = auth.uid()`, so every member counted exactly themselves.
-- Community-wide aggregates have to run past per-row RLS, hence SECURITY DEFINER.
-- Only three integers are returned — no member rows are exposed.
--
-- Problem 2 — the leaderboard used ROW_NUMBER(), which breaks ties arbitrarily:
-- two people on 50 coins were shown as ranks 1 and 2 with no tie-break rule, and
-- the order could change between loads. RANK() lets equal scores share a rank,
-- and a name tiebreak makes the ordering stable across refreshes.

CREATE OR REPLACE FUNCTION public.get_campus_cartel_stats()
RETURNS TABLE (member_count INT, unique_colleges INT, total_coins BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*)::INT
       FROM campus_cartel_members
      WHERE is_active AND status = 'approved'),
    (SELECT COUNT(DISTINCT college)::INT
       FROM campus_cartel_members
      WHERE is_active AND status = 'approved' AND college IS NOT NULL),
    (SELECT COALESCE(SUM(total_earned), 0)::BIGINT
       FROM wallet_balances);
$$;

GRANT EXECUTE ON FUNCTION public.get_campus_cartel_stats() TO anon, authenticated;

-- ── Leaderboard: shared ranks on ties, stable ordering ───────────────────────

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id          AS user_id,
  p.full_name,
  p.avatar_url,
  -- "Being an ambassador" lives in two places that can disagree: profiles.role and
  -- the ambassadors table. registerStudent() writes them as two separate unguarded
  -- statements, so a failed second write leaves an ambassador record with
  -- role = 'student'. An ambassadors row is the stronger signal — the admin People
  -- screen already resolves it this way (people.tsx:110); this matches it.
  CASE WHEN a.id IS NOT NULL THEN 'ambassador'::user_role ELSE p.role END AS role,
  wb.total_earned,
  wb.current_balance,
  -- College lived only on `students`, so a Campus Cartel member who joined without
  -- a students row showed no college and fell out of the "My College" filter — while
  -- the header stat counted their college. Fall back to their membership row.
  -- A scalar subquery, not a join: campus_cartel_members has no unique constraint on
  -- user_id, and a duplicate row would otherwise multiply leaderboard entries.
  COALESCE(
    s.college,
    (SELECT m.college
       FROM campus_cartel_members m
      WHERE m.user_id = p.id AND m.college IS NOT NULL
      ORDER BY m.joined_at DESC
      LIMIT 1)
  ) AS college,
  a.referral_code   AS ambassador_code,
  a.tier            AS ambassador_tier,
  RANK() OVER (ORDER BY wb.total_earned DESC) AS rank
FROM profiles p
JOIN wallet_balances wb ON wb.user_id = p.id
LEFT JOIN students s    ON s.user_id  = p.id
LEFT JOIN ambassadors a ON a.user_id  = p.id
WHERE p.role IN ('student', 'ambassador', 'people')
  AND wb.total_earned > 0
ORDER BY wb.total_earned DESC, p.full_name ASC;
