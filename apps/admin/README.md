# Upshot Admin

The web portal admins use to run Upshot. It talks to the same Supabase project
as the mobile app through the shared `@upshot/api-client`, so anything approved
or created here shows up in the app immediately, and vice versa.

The mobile app's own admin tabs are untouched — this portal sits alongside them.

## Running it

```bash
cp apps/admin/.env.example apps/admin/.env.local   # fill in from apps/mobile/.env
yarn admin
```

Then open http://localhost:3000. Sign in with an existing Supabase account whose
`profiles.role` is `admin`; anything else is signed straight back out.

## What it covers

Every screen the in-app admin section has:

| Portal route | Replaces |
| --- | --- |
| `/dashboard` | Admin dashboard — pending count, totals, upcoming events |
| `/events` | Event approvals and host proposals, in one place |
| `/events/[id]` | Attendees: going / waiting / removed, with reject and delete |
| `/events/proposals/[id]` | A host's proposal in full, approve or reject |
| `/people` | People directory, searchable, filtered by category |
| `/people/[id]` | One person: ambassador status, coin awards |
| `/tasks` | Review submissions, delete tasks |
| `/tasks/new` | Create a task for a group or one person |
| `/campus-cartel` | Cartel applications |
| `/ambassador-codes` | Issue and deactivate codes |
| `/unfiltered` | Episodes and guest requests |
| `/settings` | The admin's own profile |

## Where automation goes

Next route handlers under `app/api/` are the place for scheduled or triggered
work — a nightly digest, a webhook, an auto-close on stale applications. They run
server-side, so they can hold a service-role key that the browser never sees.
Nothing is wired up yet; the directory is the intended home when you want it.

## Notes

- The shared packages ship raw TypeScript, so `next.config.mjs` lists them under
  `transpilePackages`.
- Session storage falls back to `localStorage` in the browser — the shared client
  only reaches for AsyncStorage when it is actually installed.
- Access is checked against `profiles.role` on every load, not just at login, so
  a demoted account loses the portal on its next visit.
