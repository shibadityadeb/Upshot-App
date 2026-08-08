-- Host accounts: organisation + position details captured during host sign-up.
--
-- A host signs up through a dedicated flow (personal -> company -> position),
-- lands in the host area, proposes events, and watches participants roll in.
-- Approval of both the event proposal and each applicant stays with admins.

CREATE TABLE IF NOT EXISTS hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  -- Company / organisation
  org_legal_name TEXT NOT NULL,
  org_city TEXT NOT NULL,
  org_state TEXT NOT NULL,
  org_sector TEXT NOT NULL,
  org_website TEXT,
  -- Position held by this person at the organisation
  designation TEXT NOT NULL,
  department TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hosts_user_id_idx ON hosts(user_id);

ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY hosts_select ON hosts FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY hosts_insert ON hosts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY hosts_update ON hosts FOR UPDATE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE TRIGGER set_hosts_updated_at
  BEFORE UPDATE ON hosts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Let hosts create events ──────────────────────────────────────────────────
DROP POLICY IF EXISTS events_insert ON events;
CREATE POLICY events_insert ON events FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'company', 'people', 'student', 'host')
  )
);

-- ── Let an event's creator read its applications ─────────────────────────────
--
-- The original policy only covered the applicant, admins, and the contact person
-- of the owning company. Host-created events carry company_id = NULL, so a host
-- could not see who had applied to their own event. Keyed on events.created_by
-- so it covers hosts and any other non-company creator.
DROP POLICY IF EXISTS event_applications_select ON event_applications;
CREATE POLICY event_applications_select ON event_applications FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (
    SELECT 1 FROM events e
    JOIN companies c ON c.id = e.company_id
    WHERE e.id = event_applications.event_id AND c.contact_person_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = event_applications.event_id AND e.created_by = auth.uid()
  )
);
