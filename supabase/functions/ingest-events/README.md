# Event ingestion — deploy & operate

Pulls free external events in daily, lists them as normal events, and **redirects
registration to the official host** (Upshot never takes it). Auto-published;
admins can hide/remove/feature any of them. New events come in, dropped ones
retire automatically.

## One-time setup (you run these — they need your Supabase project)

### 1. Apply the migrations
```bash
cd /Users/arohijadhav/Upshot-App
supabase db push
```
(or paste `supabase/migrations/030_*.sql` and `031_*.sql` into the Supabase SQL editor)

### 2. Get the free Ticketmaster key
developer.ticketmaster.com → register → create an app → copy the **Consumer Key**.

### 3. Deploy the function + set the key as a secret
```bash
supabase functions deploy ingest-events
supabase secrets set TICKETMASTER_API_KEY=your_consumer_key_here
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically at runtime.

### 4. Schedule the daily run (Supabase SQL editor)
```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'ingest-events-daily',
  '0 3 * * *',                      -- every day at 03:00
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.functions.supabase.co/ingest-events',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
                 'Content-Type',  'application/json'),
    body    := '{}'::jsonb
  );
  $$
);
```
Replace `<PROJECT_REF>` and `<SERVICE_ROLE_KEY>`. (For extra safety, store the key in
**Supabase Vault** and read it in the cron body instead of inlining it.)

### 5. Turn it on in the app
**Admin → Dashboard → Event Sources** → enable **Ticketmaster**, set the cities
(blank = all India), tap **Sync now** to pull immediately.

## Sources
- **ticketmaster** — free Discovery API (set `TICKETMASTER_API_KEY`). Works now.
- **schema_org** — parses schema.org `Event` JSON-LD from URLs you provide in the
  source's `config.urls` (only point it at ToS-permissive pages). Set via SQL:
  ```sql
  update public.event_sources
    set config = jsonb_build_object('urls', array['https://…','https://…'])
    where key = 'schema_org';
  ```

## How admin control works
- **Hide / remove** an external event → set its status to `cancelled` in the admin
  Events screen. The sync **never re-publishes** a hidden event (it only updates
  date/venue/title), so your removal sticks.
- **Feature** → star it like any event; it moves into the home Special Events rail.
- **Recommended** placement is automatic (the recommendation engine ranks it).

## Compliance (see the research doc)
List + redirect out, don't host registration, attribute the source, don't copy
logos, keep descriptions short/neutral. Get legal sign-off on the ingestion policy.
