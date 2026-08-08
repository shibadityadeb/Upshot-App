-- Enforce Campus Cartel task targeting in the database.
--
-- Before this migration the student/ambassador split existed only as a client-side
-- `.in('target_group', groups)` filter: the tasks_select policy admitted any row with
-- `target_group IS NOT NULL` to every caller, so a student could read ambassador-only
-- tasks (and vice versa) with one direct API call. Membership in campus_cartel_members
-- was likewise checked only in the UI.
--
-- Targeting rules being enforced here:
--   campus_cartel -> ambassadors + approved active cartel members
--   students      -> role student/people, and an approved active cartel member
--   ambassadors   -> role ambassador only
--
-- Ambassadors are exempt from the membership row, matching the existing UI gate.

-- ── 1. Link a submission copy to the group task it came from ─────────────────
--
-- Submissions were previously matched back to their original by
-- `title || assigned_by`, so two tasks from the same admin sharing a title were
-- indistinguishable — submitting one hid the other permanently. An explicit FK
-- makes the relationship exact and gives the integrity trigger something to
-- pin the reward against.

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tasks_source_task_id_idx ON tasks(source_task_id);

-- One submission per person per group task — also stops a double coin award.
CREATE UNIQUE INDEX IF NOT EXISTS tasks_one_submission_per_source
  ON tasks(source_task_id, assigned_to)
  WHERE source_task_id IS NOT NULL;

-- ── 2. Audience helpers ──────────────────────────────────────────────────────
--
-- SECURITY INVOKER on purpose: profiles is world-readable (profiles_select
-- USING true) and ccm_select_own lets a user read their own membership row, so
-- these resolve correctly without handing out elevated access.

CREATE OR REPLACE FUNCTION public.is_active_cartel_member()
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM campus_cartel_members m
    WHERE m.user_id = auth.uid()
      AND m.status = 'approved'
      AND m.is_active
  );
$$;

CREATE OR REPLACE FUNCTION public.current_role_is(roles user_role[])
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = ANY(roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_see_task_group(group_name TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT CASE group_name
    WHEN 'ambassadors' THEN
      public.current_role_is(ARRAY['ambassador']::user_role[])
    WHEN 'students' THEN
      public.current_role_is(ARRAY['student', 'people']::user_role[])
      AND public.is_active_cartel_member()
    WHEN 'campus_cartel' THEN
      public.current_role_is(ARRAY['ambassador']::user_role[])
      OR public.is_active_cartel_member()
    ELSE FALSE
  END;
$$;

-- ── 3. Targeted SELECT ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS tasks_select ON tasks;
CREATE POLICY tasks_select ON tasks FOR SELECT USING (
  assigned_to = auth.uid()
  OR assigned_by = auth.uid()
  OR (target_group IS NOT NULL AND public.can_see_task_group(target_group))
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ── 4. Submission integrity ──────────────────────────────────────────────────
--
-- tasks_insert allows `assigned_to = auth.uid()` so the clone-on-submit flow can
-- work, which also let a user insert a self-assigned row carrying any coin_value
-- and drop it straight into the admin review queue. This trigger rewrites every
-- non-admin insert from its source task, so the reward can only ever be the one
-- the admin authored.

CREATE OR REPLACE FUNCTION public.enforce_task_submission_integrity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  src tasks%ROWTYPE;
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.source_task_id IS NULL THEN
    RAISE EXCEPTION 'A task submission must reference the group task it came from';
  END IF;

  SELECT * INTO src FROM tasks WHERE id = NEW.source_task_id;
  IF NOT FOUND OR src.target_group IS NULL THEN
    RAISE EXCEPTION 'Source task is not a group task';
  END IF;

  IF NOT public.can_see_task_group(src.target_group) THEN
    RAISE EXCEPTION 'You are not in the target group for this task';
  END IF;

  NEW.assigned_to  := auth.uid();
  NEW.assigned_by  := src.assigned_by;
  NEW.title        := src.title;
  NEW.description  := src.description;
  NEW.event_id     := src.event_id;
  NEW.due_date     := src.due_date;
  NEW.coin_value   := src.coin_value;
  NEW.target_group := NULL;
  NEW.status       := 'submitted';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_task_submission_integrity_trg ON tasks;
CREATE TRIGGER enforce_task_submission_integrity_trg
  BEFORE INSERT ON tasks
  FOR EACH ROW EXECUTE FUNCTION public.enforce_task_submission_integrity();

-- Non-admins may attach submission content, never reward or review state.
CREATE OR REPLACE FUNCTION public.enforce_task_update_integrity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;

  NEW.coin_value     := OLD.coin_value;
  NEW.target_group   := OLD.target_group;
  NEW.assigned_to    := OLD.assigned_to;
  NEW.assigned_by    := OLD.assigned_by;
  NEW.source_task_id := OLD.source_task_id;
  NEW.reviewed_at    := OLD.reviewed_at;
  NEW.review_note    := OLD.review_note;

  IF NEW.status NOT IN ('assigned', 'in_progress', 'submitted') THEN
    NEW.status := OLD.status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_task_update_integrity_trg ON tasks;
CREATE TRIGGER enforce_task_update_integrity_trg
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION public.enforce_task_update_integrity();

-- ── 5. Close the direct coin-minting path ────────────────────────────────────
--
-- coin_transactions_insert allowed `user_id = auth.uid()`, so anyone could credit
-- their own wallet with an arbitrary amount — the update_wallet_balance trigger
-- applies it on insert, no task or review required. Award paths that legitimately
-- credit another user (award_referral_coins) are SECURITY DEFINER and bypass RLS,
-- so restricting this to admins does not break referrals.

DROP POLICY IF EXISTS coin_transactions_insert ON coin_transactions;
CREATE POLICY coin_transactions_insert ON coin_transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
