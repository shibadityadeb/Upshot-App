-- ─── External event aggregation ──────────────────────────────────────────────
--
-- Events pulled from other platforms (Ticketmaster, schema.org/city feeds, …)
-- are stored as normal rows in `events`, tagged with their `source`. They flow
-- through the same recommendation ranking and admin tools as native events; the
-- only difference is registration — external events REDIRECT to `source_url`
-- (we never take their registration), so they carry no coins/attendee flow.
--
-- A daily Edge Function (using the service role, which bypasses RLS) upserts the
-- latest list per source: new events are inserted, changed ones updated, and
-- ones that dropped off the source are retired. Dedupe is by (source, external_id).

-- 1 ── Source tagging on events ───────────────────────────────────────────────
alter table public.events
  add column if not exists source       text not null default 'upshot',
  add column if not exists source_url    text,           -- the official registration link
  add column if not exists source_name   text,           -- display label, e.g. "Ticketmaster"
  add column if not exists external_id    text,           -- stable id within the source
  add column if not exists is_external    boolean not null default false,
  add column if not exists last_seen_at   timestamptz;    -- updated each sync it still appears

-- External events have no Upshot creator — allow a null author.
alter table public.events alter column created_by drop not null;

-- One row per (source, external_id) so re-syncs update instead of duplicate.
-- Non-partial so it can back an upsert ON CONFLICT; native events keep
-- external_id = null, and NULLs are distinct, so they never collide.
create unique index if not exists uq_events_source_external
  on public.events (source, external_id);

create index if not exists idx_events_is_external
  on public.events (is_external) where is_external = true;

-- 2 ── Source configuration (admin-managed) ───────────────────────────────────
-- Holds only non-secret config (enabled, which cities/categories to pull, last
-- sync time). API keys live in Edge Function secrets, never here.
create table if not exists public.event_sources (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,        -- 'ticketmaster', 'schema_org', …
  name          text not null,               -- display name
  enabled       boolean not null default false,
  cities        text[] not null default '{}',-- cities to pull (empty = source default)
  categories    text[] not null default '{}',-- optional category filter
  config        jsonb  not null default '{}', -- per-source extras (e.g. feed URLs)
  last_synced_at timestamptz,
  last_result   text,                        -- short status of the last run
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.event_sources enable row level security;

-- Re-runnable: drop existing policy/trigger before recreating.
drop policy if exists event_sources_admin_all on public.event_sources;
drop trigger if exists set_event_sources_updated_at on public.event_sources;

-- Only admins read/write source config.
create policy event_sources_admin_all
  on public.event_sources for all
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

create trigger set_event_sources_updated_at
  before update on public.event_sources
  for each row execute function set_updated_at();

grant select, insert, update, delete on public.event_sources to authenticated;

-- Seed the free sources (disabled until an admin turns them on + the key is set).
insert into public.event_sources (key, name, enabled, cities)
values
  ('ticketmaster', 'Ticketmaster', false, '{}'),
  ('schema_org',   'Web (schema.org feeds)', false, '{}')
on conflict (key) do nothing;
