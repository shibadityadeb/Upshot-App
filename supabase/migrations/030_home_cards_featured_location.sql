-- ─── Home featured content + location-based recommendations ──────────────────
--
-- Three additions that power the redesigned home screen:
--   1. events.is_featured  — admin "stars" an event into the home Special Events rail.
--   2. profiles.city       — a viewer's city, so recommendations can prefer events near them.
--   3. home_cards          — admin-managed "Featured Experiences" cards (cover, link, order, count).

-- 1 ── Featured events ────────────────────────────────────────────────────────
alter table public.events
  add column if not exists is_featured boolean not null default false;

create index if not exists idx_events_is_featured
  on public.events (is_featured) where is_featured = true;

-- 2 ── Viewer location ────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists city text;

-- 3 ── Admin-managed home cards ───────────────────────────────────────────────
-- Admins control each card's cover image, title/subtitle, the redirect target
-- (`link` = an internal route like "/(people)/campus-cartel" OR an external
-- https URL), the CTA label, the order, and how many cards exist. Everyone
-- reads the active ones; only admins write.
create table if not exists public.home_cards (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  badge       text,
  cover_url   text,
  link        text not null,
  cta         text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.home_cards enable row level security;

-- Re-runnable: drop existing policies/trigger before recreating.
drop policy if exists home_cards_select on public.home_cards;
drop policy if exists home_cards_insert on public.home_cards;
drop policy if exists home_cards_update on public.home_cards;
drop policy if exists home_cards_delete on public.home_cards;
drop trigger if exists set_home_cards_updated_at on public.home_cards;

-- Everyone authenticated reads active cards; admins read all.
create policy home_cards_select
  on public.home_cards for select
  using (
    is_active = true
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Only admins create / update / delete.
create policy home_cards_insert
  on public.home_cards for insert
  with check (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

create policy home_cards_update
  on public.home_cards for update
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

create policy home_cards_delete
  on public.home_cards for delete
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- Keep updated_at fresh (set_updated_at defined in earlier migrations).
create trigger set_home_cards_updated_at
  before update on public.home_cards
  for each row execute function set_updated_at();

grant select, insert, update, delete on public.home_cards to authenticated;

create index idx_home_cards_order
  on public.home_cards (sort_order asc, created_at asc);
