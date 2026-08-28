-- Event applications approve themselves, up to the event's capacity.
--
-- Applying puts the person straight onto the attendee list — the admin no
-- longer works an approval queue, they read who is coming and reject or delete
-- anyone who should not be there. Once the event is full, further applicants
-- land on a waiting list ('pending') instead, and are promoted automatically,
-- oldest first, whenever a seat frees up.
--
-- The bar is events.max_attendees — the max capacity the host fills in when
-- they propose the event. That field is optional, and an event that leaves it
-- blank has no limit at all: everyone who applies gets in.
--
-- Attendee counting moves out of the client into a trigger so the number stays
-- right whichever path writes the row.

-- ── 1. New applications land approved ────────────────────────────────────────
ALTER TABLE event_applications ALTER COLUMN status SET DEFAULT 'approved';

-- ── 2. Clear the old queue, up to capacity ───────────────────────────────────
-- Runs before the triggers below exist, so no capacity check fights with it.
-- Anyone who applied beyond the host's stated capacity stays 'pending' and is
-- now a waiting-list entry rather than someone awaiting a decision. Events with
-- no capacity set take everybody.
WITH ranked AS (
  SELECT
    a.id,
    ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.applied_at) AS seat,
    e.max_attendees AS cap,
    (
      SELECT COUNT(*)
      FROM event_applications x
      WHERE x.event_id = a.event_id AND x.status = 'approved'
    ) AS taken
  FROM event_applications a
  JOIN events e ON e.id = a.event_id
  WHERE a.status = 'pending'
)
UPDATE event_applications a
SET status = 'approved'
FROM ranked r
WHERE a.id = r.id
  AND (r.cap IS NULL OR r.taken + r.seat <= r.cap);

-- ── 3. Rebuild every count from the rows themselves ──────────────────────────
UPDATE events e
SET current_attendees = (
  SELECT COUNT(*)
  FROM event_applications a
  WHERE a.event_id = e.id AND a.status = 'approved'
);

-- ── 4. Capacity gate ─────────────────────────────────────────────────────────
-- On apply: take the seat if one is free, otherwise join the waiting list. A
-- withdrawn row going back to approved is the same person re-applying, so it is
-- treated the same way. An admin letting somebody in by hand is refused outright
-- rather than silently demoted, so they can see why it did not work.
CREATE OR REPLACE FUNCTION enforce_event_capacity()
RETURNS TRIGGER AS $$
DECLARE
  cap   INTEGER;
  taken INTEGER;
BEGIN
  IF NEW.status <> 'approved' THEN
    RETURN NEW;
  END IF;

  -- Already holding a seat and keeping it — nothing to re-check.
  IF TG_OP = 'UPDATE' AND OLD.status = 'approved' THEN
    RETURN NEW;
  END IF;

  -- FOR UPDATE serialises two people applying to the same event at once, so the
  -- last seat cannot be handed out twice.
  SELECT max_attendees INTO cap
  FROM events
  WHERE id = NEW.event_id
  FOR UPDATE;

  -- No event row (the foreign key will raise the real error), or the host left
  -- max capacity blank, which means no limit — either way, let it through.
  IF NOT FOUND OR cap IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO taken
  FROM event_applications
  WHERE event_id = NEW.event_id
    AND status = 'approved'
    AND id <> NEW.id;

  -- Nested rather than one OR'd condition: OLD is NULL on INSERT and PL/pgSQL
  -- does not promise to short-circuit.
  IF taken >= cap THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'pending';        -- waiting list
    ELSIF OLD.status = 'withdrawn' THEN
      NEW.status := 'pending';        -- re-applying after giving up a seat
    ELSE
      RAISE EXCEPTION 'This event is full (% of % seats taken)', taken, cap
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_event_capacity_trigger ON event_applications;
CREATE TRIGGER enforce_event_capacity_trigger
  BEFORE INSERT OR UPDATE OF status ON event_applications
  FOR EACH ROW EXECUTE FUNCTION enforce_event_capacity();

-- ── 5. events.current_attendees follows the approved rows ────────────────────
-- SECURITY DEFINER matters: an applicant has no UPDATE rights on events, so the
-- count would silently never move if this ran as the caller.
CREATE OR REPLACE FUNCTION sync_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'approved' THEN
      UPDATE events SET current_attendees = current_attendees + 1
      WHERE id = NEW.event_id;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status <> 'approved' AND NEW.status = 'approved' THEN
      UPDATE events SET current_attendees = current_attendees + 1
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'approved' AND NEW.status <> 'approved' THEN
      UPDATE events SET current_attendees = GREATEST(current_attendees - 1, 0)
      WHERE id = NEW.event_id;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'approved' THEN
      UPDATE events SET current_attendees = GREATEST(current_attendees - 1, 0)
      WHERE id = OLD.event_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_event_attendees_trigger ON event_applications;
CREATE TRIGGER sync_event_attendees_trigger
  AFTER INSERT OR UPDATE OF status OR DELETE ON event_applications
  FOR EACH ROW EXECUTE FUNCTION sync_event_attendees();

-- ── 6. A freed seat pulls the next person off the waiting list ───────────────
-- Fires only when a seat is released (rejected, withdrawn, deleted), never when
-- one is filled, so promoting somebody cannot trigger another promotion.
CREATE OR REPLACE FUNCTION promote_waitlisted_application()
RETURNS TRIGGER AS $$
DECLARE
  cap     INTEGER;
  taken   INTEGER;
  next_id UUID;
BEGIN
  -- Only a released seat opens the list. Filling one must not cascade into
  -- another promotion, or a single free seat would drain the whole waiting list.
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status <> 'approved' OR NEW.status = 'approved' THEN
      RETURN NULL;
    END IF;
  ELSIF OLD.status <> 'approved' THEN
    RETURN NULL;
  END IF;

  SELECT max_attendees INTO cap
  FROM events
  WHERE id = OLD.event_id;

  -- Event is gone (its applications cascaded away) — nothing to promote into.
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- A capped event only promotes into a seat that is genuinely free. An
  -- uncapped one always has room, so anyone left waiting there (from before the
  -- cap was lifted) moves up.
  IF cap IS NOT NULL THEN
    SELECT COUNT(*) INTO taken
    FROM event_applications
    WHERE event_id = OLD.event_id AND status = 'approved';

    IF taken >= cap THEN
      RETURN NULL;
    END IF;
  END IF;

  SELECT id INTO next_id
  FROM event_applications
  WHERE event_id = OLD.event_id AND status = 'pending'
  ORDER BY applied_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF next_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE event_applications SET status = 'approved' WHERE id = next_id;

  INSERT INTO notifications (user_id, title, body, type, reference_id)
  SELECT user_id,
         'A spot opened up',
         'You are off the waiting list and on the attendee list for this event.',
         'application_status',
         OLD.event_id::TEXT
  FROM event_applications
  WHERE id = next_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS promote_waitlisted_trigger ON event_applications;
-- Named so it sorts before sync_event_attendees_trigger only by accident; the
-- function counts rows rather than reading current_attendees, so either order
-- of the two AFTER triggers gives the same result.
CREATE TRIGGER promote_waitlisted_trigger
  AFTER UPDATE OF status OR DELETE ON event_applications
  FOR EACH ROW EXECUTE FUNCTION promote_waitlisted_application();

-- ── 7. Admins can remove an attendee outright ────────────────────────────────
DROP POLICY IF EXISTS event_applications_delete ON event_applications;
CREATE POLICY event_applications_delete ON event_applications FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
