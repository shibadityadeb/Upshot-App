-- ─── Unfiltered Feature Requests ─────────────────────────────────────────────
-- People request to be featured as a guest on the Unfiltered podcast.
-- Submissions are visible to admins (and the submitter). Admins review them.

create table if not exists public.unfiltered_feature_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id),
  -- Contact
  full_name     text not null,
  email         text not null,
  phone         text,
  -- Guest details
  expertise     text,           -- profession / title / area of expertise
  organisation  text,
  topic         text not null,  -- what they want to talk about (the pitch)
  bio           text,           -- short about-you
  social_url    text,           -- Instagram / LinkedIn / portfolio link
  -- Review
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'contacted')),
  admin_note    text,
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.unfiltered_feature_requests enable row level security;

-- Submitter can see their own; admins can see all
create policy unfiltered_feature_requests_select
  on public.unfiltered_feature_requests for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Any authenticated user can submit their own request
create policy unfiltered_feature_requests_insert
  on public.unfiltered_feature_requests for insert
  with check (auth.uid() = user_id);

-- Submitter can edit while still pending; admins can always update (review)
create policy unfiltered_feature_requests_update
  on public.unfiltered_feature_requests for update
  using (
    (auth.uid() = user_id and status = 'pending')
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Submitter can withdraw while pending
create policy unfiltered_feature_requests_delete
  on public.unfiltered_feature_requests for delete
  using (auth.uid() = user_id and status = 'pending');

-- Keep updated_at fresh (set_updated_at defined in earlier migrations)
create trigger set_unfiltered_feature_requests_updated_at
  before update on public.unfiltered_feature_requests
  for each row execute function set_updated_at();

-- Grants
grant select, insert, update, delete on public.unfiltered_feature_requests to authenticated;

-- Index for admin ordering (newest first)
create index idx_unfiltered_feature_requests_created_at
  on public.unfiltered_feature_requests (created_at desc);
