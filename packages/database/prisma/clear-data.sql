-- Clears all row data from the public schema while keeping the schema
-- (tables, columns, policies, triggers) intact. Admin accounts survive:
-- every auth.users row whose profile has role = 'admin' is kept, along
-- with its profile. Everything else is wiped.
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('profiles', '_prisma_migrations')
  LOOP
    EXECUTE format('TRUNCATE TABLE public.%I CASCADE', t);
  END LOOP;

  -- Cascades to public.profiles (FK ON DELETE CASCADE), so only
  -- admin profiles remain.
  DELETE FROM auth.users
  WHERE id NOT IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  );
END $$;
