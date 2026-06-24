# Upshot Brand Media — Operations App

Monorepo for the Upshot Brand Media mobile application built with Expo, React Native, Prisma, and Supabase.

## Prerequisites

- Node.js 18+
- Yarn
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Setup

```bash
# 1. Clone the repo
git clone <repo-url> && cd upshot

# 2. Install dependencies
yarn install

# 3. Configure environment variables
cp apps/mobile/.env.example apps/mobile/.env
cp packages/database/.env.example packages/database/.env
# Fill in your Supabase URL, anon key, and DATABASE_URL

# 4. Start local Supabase (requires Docker)
supabase start

# 5. Run the SQL migration (triggers, RLS, functions)
supabase db push

# 6. Generate Prisma client
yarn db:generate

# 7. Push Prisma schema to database
yarn db:push

# 8. Start the mobile app
cd apps/mobile && yarn start
```

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@upshot/mobile` | `apps/mobile` | Expo 51 + React Native mobile app |
| `@upshot/types` | `packages/types` | Shared TypeScript type definitions |
| `@upshot/database` | `packages/database` | Prisma schema, client, and DB utilities |
| `@upshot/api-client` | `packages/api-client` | Service classes (Prisma for data, Supabase for auth) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `DATABASE_URL` | PostgreSQL connection string for Prisma |

## Database

Two complementary systems manage the database:

- **Prisma** (`packages/database/prisma/schema.prisma`) — schema source of truth, generates typed client for all data queries
- **SQL migrations** (`supabase/migrations/`) — handles Supabase-specific features: triggers, RLS policies, custom functions (referral code generation, wallet balance updates, auto profile creation)

Tables: profiles, companies, events, event_requirements, event_applications, tasks, coin_transactions, wallet_balances, ambassadors, students, notifications

## Architecture

- **Supabase Auth** handles sign in, sign up, sessions, password reset
- **Prisma Client** handles all data reads/writes via typed queries
- DB triggers (in SQL migration) handle: auto-creating profiles on auth signup, updating wallet balances on coin transactions, setting updated_at timestamps

## Next: Phase 2

Auth flows — sign in, sign up, student registration with referral codes, role-based navigation.
