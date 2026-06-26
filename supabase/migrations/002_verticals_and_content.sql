-- Migration 002: Verticals, content posts, workforce profiles

CREATE TABLE IF NOT EXISTS verticals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  color TEXT NOT NULL,
  cover_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID NOT NULL REFERENCES verticals(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT,
  cover_url TEXT,
  speaker_name TEXT,
  speaker_role TEXT,
  speaker_avatar_url TEXT,
  content_type TEXT NOT NULL DEFAULT 'article'
    CHECK (content_type IN ('episode','article','event_recap',
    'thought_leadership','announcement')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
  city TEXT,
  state TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  past_work_description TEXT,
  portfolio_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS vertical_id UUID REFERENCES verticals(id),
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS project_type TEXT;

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS can_discover_workforce BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS previous_work_description TEXT,
  ADD COLUMN IF NOT EXISTS logo_placeholder_color TEXT DEFAULT '#1B2CC1';

-- RLS
ALTER TABLE verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "verticals_select_all" ON verticals
  FOR SELECT USING (TRUE);

CREATE POLICY "content_posts_select_published" ON content_posts
  FOR SELECT USING (published_at IS NOT NULL OR
    EXISTS (SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "content_posts_admin_all" ON content_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "workforce_profiles_select_all" ON workforce_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "workforce_profiles_own" ON workforce_profiles
  FOR ALL USING (user_id = auth.uid());

-- Seed verticals
INSERT INTO verticals (name, slug, tagline, color, sort_order)
VALUES
  ('Unfiltered', 'unfiltered',
   'Real conversations with leaders who are changing the game',
   '#6D28D9', 1),
  ('Campus Cartel', 'campus-cartel',
   'India''s largest student ambassador and campus network',
   '#059669', 2),
  ('iRISE', 'irise',
   'Celebrating women who lead, inspire and transform',
   '#D97706', 3),
  ('iBelieve', 'ibelieve',
   'Where entrepreneurs and business leaders connect',
   '#DC2626', 4)
ON CONFLICT (slug) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_posts_vertical ON content_posts(vertical_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_featured ON content_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_workforce_city ON workforce_profiles(city);
