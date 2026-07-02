-- ─── Unfiltered Videos ───────────────────────────────────────────────────────
-- Stores YouTube links for the Unfiltered brand podcasts/conversations.
-- Admin adds links; only the 10 most recent are displayed on the Unfiltered page.

create table if not exists public.unfiltered_videos (
  id            uuid primary key default gen_random_uuid(),
  youtube_url   text not null,
  title         text not null,
  description   text,
  thumbnail_url text,
  is_featured   boolean not null default false,
  channel_url   text,          -- YouTube channel / playlist "See All" link
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.unfiltered_videos enable row level security;

-- Everyone can read
create policy "Anyone can view unfiltered videos"
  on public.unfiltered_videos for select
  using (true);

-- Only admins can insert / update / delete
create policy "Admins can manage unfiltered videos"
  on public.unfiltered_videos for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Grants
grant select on public.unfiltered_videos to anon, authenticated;
grant insert, update, delete on public.unfiltered_videos to authenticated;

-- Index for ordering
create index idx_unfiltered_videos_created_at on public.unfiltered_videos (created_at desc);
