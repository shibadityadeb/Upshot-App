-- Guarantee every ambassador gets a unique, server-generated referral code, and
-- retire the leaderboard.
--
-- Problem: generate_random_code() picked 8 random characters and returned them
-- without checking anything. ambassadors.referral_code is UNIQUE, so a collision
-- surfaced as a failed INSERT that the client swallowed — the promotion silently
-- did nothing. It also never checked `ambassador_codes`, so a personal referral
-- code could duplicate an admin-issued one; since both signup and Campus Cartel
-- apply look up `ambassador_codes` FIRST, that collision would silently reroute a
-- personal referral into the admin-code path.
--
-- On top of that, both services carried a JS fallback that hand-rolled a code in a
-- different shape (UBM-XXXXYYYY, no second dash) with no uniqueness check at all.
-- Code minting now belongs to the database alone.

-- ── 1. Collision-free generation across BOTH code namespaces ─────────────────

CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  -- No 0/O/1/I — these codes get read aloud and typed by hand.
  chars    TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate TEXT;
  i        INTEGER;
  attempt  INTEGER := 0;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..8 LOOP
      candidate := candidate || substr(chars, floor(random() * length(chars) + 1)::int, 1);
      IF i = 4 THEN candidate := candidate || '-'; END IF;
    END LOOP;
    candidate := 'UBM-' || candidate;

    EXIT WHEN NOT EXISTS (SELECT 1 FROM ambassadors      WHERE referral_code = candidate)
          AND NOT EXISTS (SELECT 1 FROM ambassador_codes WHERE code          = candidate);

    attempt := attempt + 1;
    IF attempt >= 50 THEN
      -- 32^8 of keyspace; 50 straight collisions means something is wrong, and
      -- failing loudly beats handing back a duplicate.
      RAISE EXCEPTION 'Could not generate a unique referral code after % attempts', attempt;
    END IF;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Existing callers (registerStudent, promoteToAmbassador, the admin code panel)
-- keep using the old name and now get the collision-checked implementation.
CREATE OR REPLACE FUNCTION public.generate_random_code()
RETURNS TEXT
LANGUAGE SQL
AS $$ SELECT public.generate_unique_referral_code(); $$;

-- ── 2. An ambassador cannot exist without a unique code ─────────────────────
--
-- Belt and braces: even if a client inserts an ambassador row with no code (or a
-- blank one), the database fills it. Nothing has to remember to generate one.

CREATE OR REPLACE FUNCTION public.ensure_ambassador_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR btrim(NEW.referral_code) = '' THEN
    NEW.referral_code := public.generate_unique_referral_code();
  ELSE
    NEW.referral_code := upper(btrim(NEW.referral_code));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_ambassador_referral_code_trg ON ambassadors;
CREATE TRIGGER ensure_ambassador_referral_code_trg
  BEFORE INSERT ON ambassadors
  FOR EACH ROW EXECUTE FUNCTION public.ensure_ambassador_referral_code();

-- A personal referral code must never duplicate an admin-issued one, whichever
-- table it is written to first.
CREATE OR REPLACE FUNCTION public.reject_cross_namespace_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'ambassadors' THEN
    IF EXISTS (SELECT 1 FROM ambassador_codes WHERE code = NEW.referral_code) THEN
      RAISE EXCEPTION 'Referral code % already exists as an admin-issued code', NEW.referral_code;
    END IF;
  ELSE
    IF EXISTS (SELECT 1 FROM ambassadors WHERE referral_code = NEW.code) THEN
      RAISE EXCEPTION 'Code % is already an ambassador''s personal referral code', NEW.code;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reject_cross_namespace_code_amb ON ambassadors;
CREATE TRIGGER reject_cross_namespace_code_amb
  BEFORE INSERT OR UPDATE OF referral_code ON ambassadors
  FOR EACH ROW EXECUTE FUNCTION public.reject_cross_namespace_code();

DROP TRIGGER IF EXISTS reject_cross_namespace_code_codes ON ambassador_codes;
CREATE TRIGGER reject_cross_namespace_code_codes
  BEFORE INSERT OR UPDATE OF code ON ambassador_codes
  FOR EACH ROW EXECUTE FUNCTION public.reject_cross_namespace_code();

-- ── 3. Retire the leaderboard ───────────────────────────────────────────────
--
-- The feature is gone from the app; the view and the policy that existed purely
-- to feed it go with it. wallet_balances_select_leaderboard was `USING (true)`,
-- which exposed every user's coin totals to any caller — dropping it restores
-- wallet_balances_select ("your own row only").
--
-- get_campus_cartel_stats() still reports the community coin total, but it is
-- SECURITY DEFINER and returns a single aggregate, not per-user balances.

DROP VIEW IF EXISTS leaderboard;
DROP POLICY IF EXISTS wallet_balances_select_leaderboard ON wallet_balances;
