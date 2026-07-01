-- Hosting applications: people can apply to host events
CREATE TABLE IF NOT EXISTS hosting_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT NOT NULL,
  location_url TEXT,
  category TEXT NOT NULL DEFAULT 'social',
  max_attendees INTEGER,
  requirements TEXT,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE hosting_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY hosting_apps_select ON hosting_applications FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY hosting_apps_insert ON hosting_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY hosting_apps_update ON hosting_applications FOR UPDATE USING (
  (auth.uid() = user_id AND status = 'pending')
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY hosting_apps_delete ON hosting_applications FOR DELETE USING (
  auth.uid() = user_id AND status = 'pending'
);

CREATE TRIGGER set_hosting_applications_updated_at
  BEFORE UPDATE ON hosting_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Update events INSERT policy to allow people/students (for admin creating on their behalf)
DROP POLICY IF EXISTS events_insert ON events;
CREATE POLICY events_insert ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'company', 'people', 'student'))
);

-- NOTE: Create Supabase Storage bucket manually:
-- Storage > New bucket > Name: event-covers > Public: ON
