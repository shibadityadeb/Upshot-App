-- ============================================================
-- Upshot Brand Media — Initial Schema Migration
-- ============================================================

-- ─── Custom Types ────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'company', 'people', 'ambassador', 'student');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('assigned', 'in_progress', 'submitted', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('earned', 'redeemed', 'bonus', 'penalty');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ambassador_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Tables ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'people',
  phone       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  logo_url          TEXT,
  website           TEXT,
  industry          TEXT,
  description       TEXT,
  contact_person_id UUID NOT NULL REFERENCES profiles(id),
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  company_id         UUID NOT NULL REFERENCES companies(id),
  event_date         DATE NOT NULL,
  event_time         TIME,
  location           TEXT NOT NULL,
  location_url       TEXT,
  category           TEXT NOT NULL,
  banner_url         TEXT,
  max_attendees      INT,
  current_attendees  INT NOT NULL DEFAULT 0,
  status             event_status NOT NULL DEFAULT 'draft',
  requirements       TEXT,
  coin_reward        INT NOT NULL DEFAULT 0,
  created_by         UUID NOT NULL REFERENCES profiles(id),
  approved_by        UUID REFERENCES profiles(id),
  approved_at        TIMESTAMPTZ,
  rejection_reason   TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_requirements (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id  UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id),
  status      application_status NOT NULL DEFAULT 'pending',
  note        TEXT,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  event_id        UUID REFERENCES events(id),
  assigned_to     UUID NOT NULL REFERENCES profiles(id),
  assigned_by     UUID NOT NULL REFERENCES profiles(id),
  status          task_status NOT NULL DEFAULT 'assigned',
  due_date        DATE,
  coin_value      INT NOT NULL DEFAULT 0,
  submission_url  TEXT,
  submission_note TEXT,
  submitted_at    TIMESTAMPTZ,
  reviewed_at     TIMESTAMPTZ,
  review_note     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_balances (
  user_id         UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_earned    INT NOT NULL DEFAULT 0,
  total_redeemed  INT NOT NULL DEFAULT 0,
  current_balance INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS coin_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  type            transaction_type NOT NULL,
  amount          INT NOT NULL,
  description     TEXT NOT NULL,
  reference_id    TEXT,
  reference_type  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ambassadors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  referral_code     TEXT NOT NULL UNIQUE,
  referral_count    INT NOT NULL DEFAULT 0,
  total_coins_earned INT NOT NULL DEFAULT 0,
  tier              ambassador_tier NOT NULL DEFAULT 'bronze',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  college         TEXT,
  course          TEXT,
  year_of_study   INT,
  ambassador_code TEXT,
  referred_by     UUID REFERENCES ambassadors(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  type         TEXT NOT NULL,
  reference_id TEXT,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_company_id ON events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_applications_user_id ON event_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_event_applications_event_id ON event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ambassadors_referral_code ON ambassadors(referral_code);

-- ─── Functions ───────────────────────────────────────────

-- Auto-create profile + wallet on new auth user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'people')
  );
  INSERT INTO wallet_balances (user_id, total_earned, total_redeemed, current_balance)
  VALUES (NEW.id, 0, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update wallet balance on new coin transaction
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type IN ('earned', 'bonus') THEN
    UPDATE wallet_balances
    SET total_earned = total_earned + NEW.amount,
        current_balance = current_balance + NEW.amount
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'redeemed' THEN
    UPDATE wallet_balances
    SET total_redeemed = total_redeemed + NEW.amount,
        current_balance = current_balance - NEW.amount
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'penalty' THEN
    UPDATE wallet_balances
    SET current_balance = current_balance - NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_coin_transaction ON coin_transactions;
CREATE TRIGGER on_coin_transaction
  AFTER INSERT ON coin_transactions
  FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_tasks_updated_at ON tasks;
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Generate unique referral code from user name
CREATE OR REPLACE FUNCTION generate_referral_code(user_name TEXT)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  prefix TEXT;
  suffix TEXT;
  attempts INT := 0;
BEGIN
  prefix := UPPER(LEFT(REGEXP_REPLACE(user_name, '[^a-zA-Z]', '', 'g'), 4));
  IF LENGTH(prefix) < 2 THEN
    prefix := 'UP';
  END IF;
  LOOP
    suffix := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
    code := prefix || suffix;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM ambassadors WHERE referral_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Could not generate unique referral code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Increment referral count helper
CREATE OR REPLACE FUNCTION increment_referral_count(ambassador_row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ambassadors
  SET referral_count = referral_count + 1
  WHERE id = ambassador_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Row Level Security ──────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only own row update
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Companies: anyone can read, admin can manage
CREATE POLICY companies_select ON companies FOR SELECT USING (true);
CREATE POLICY companies_insert ON companies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'company'))
);
CREATE POLICY companies_update ON companies FOR UPDATE USING (
  contact_person_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Events
CREATE POLICY events_select_approved ON events FOR SELECT USING (
  status = 'approved'
  OR created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM companies WHERE id = events.company_id AND contact_person_id = auth.uid())
);
CREATE POLICY events_insert ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'company'))
);
CREATE POLICY events_update ON events FOR UPDATE USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Event requirements
CREATE POLICY event_requirements_select ON event_requirements FOR SELECT USING (true);
CREATE POLICY event_requirements_insert ON event_requirements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE id = event_id AND (created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Event applications
CREATE POLICY event_applications_select ON event_applications FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (
    SELECT 1 FROM events e
    JOIN companies c ON c.id = e.company_id
    WHERE e.id = event_applications.event_id AND c.contact_person_id = auth.uid()
  )
);
CREATE POLICY event_applications_insert ON event_applications FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY event_applications_update ON event_applications FOR UPDATE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tasks
CREATE POLICY tasks_select ON tasks FOR SELECT USING (
  assigned_to = auth.uid()
  OR assigned_by = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY tasks_insert ON tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY tasks_update ON tasks FOR UPDATE USING (
  assigned_to = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY tasks_delete ON tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Coin transactions: user sees own only
CREATE POLICY coin_transactions_select ON coin_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY coin_transactions_insert ON coin_transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR user_id = auth.uid()
);

-- Wallet balances: user sees own only
CREATE POLICY wallet_balances_select ON wallet_balances FOR SELECT USING (user_id = auth.uid());

-- Notifications: user sees own only
CREATE POLICY notifications_select ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (true);

-- Ambassadors
CREATE POLICY ambassadors_select ON ambassadors FOR SELECT USING (
  is_active = true
  OR user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY ambassadors_insert ON ambassadors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR auth.uid() = user_id
);
CREATE POLICY ambassadors_update ON ambassadors FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Students
CREATE POLICY students_select ON students FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM ambassadors WHERE id = students.referred_by AND user_id = auth.uid())
);
CREATE POLICY students_insert ON students FOR INSERT WITH CHECK (auth.uid() = user_id);
