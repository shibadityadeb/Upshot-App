-- ─── Sponsor Inquiries ───────────────────────────────────────────────────────
-- Companies / individuals offer to sponsor a specific event or workshop.
-- Submissions are visible to admins (and the submitter). Admins review them.
-- Deliberately independent of event_applications: no triggers or FKs touch it.

create table if not exists public.sponsor_inquiries (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events(id) on delete cascade,
  user_id       uuid not null references public.profiles(id),
  -- Sponsor details
  company_name  text not null,
  contact_name  text not null,
  email         text not null,
  phone         text not null,
  website       text,
  why_sponsor   text not null,  -- why they want to sponsor this event
  message       text,           -- optional extra note
  -- Review
  status        text not null default 'pending'
                  check (status in ('pending', 'contacted', 'accepted', 'declined')),
  admin_note    text,
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.sponsor_inquiries enable row level security;

-- Submitter can see their own; admins can see all
create policy sponsor_inquiries_select
  on public.sponsor_inquiries for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Any authenticated user can submit their own inquiry
create policy sponsor_inquiries_insert
  on public.sponsor_inquiries for insert
  with check (auth.uid() = user_id);

-- Only admins review (update status / note)
create policy sponsor_inquiries_update
  on public.sponsor_inquiries for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Keep updated_at fresh (set_updated_at defined in earlier migrations)
create trigger set_sponsor_inquiries_updated_at
  before update on public.sponsor_inquiries
  for each row execute function set_updated_at();

-- Grants
grant select, insert, update on public.sponsor_inquiries to authenticated;

-- Index for admin ordering (newest first)
create index idx_sponsor_inquiries_created_at
  on public.sponsor_inquiries (created_at desc);
