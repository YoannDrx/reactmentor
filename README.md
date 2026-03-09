# React Mentor

React Mentor is a branded interview-prep SaaS for React, React Native, TypeScript and Frontend Systems candidates.

The current product includes:

- a premium landing page with a clear product narrative
- Better Auth wired to Prisma for email/password and optional social login
- onboarding and localized user preferences
- a protected dashboard with real overview, progress, review and mock read models
- a public `learn` teaser library paired with a protected `dashboard/learn` workspace for the full course loop
- dedicated product surfaces for modules, sessions, notes, bookmarks and playlists
- a multi-format practice/review/mock engine for `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` and `BUG_HUNT`
- an admin content workspace for modules, skills, questions, pitfall tags and import/export
- Stripe billing, entitlements and gating for premium surfaces
- lifecycle emails, product telemetry and Sentry wiring
- a Prisma schema designed for localized content, attempts, progress, playlists and billing entitlements

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Better Auth
- Prisma
- Neon-ready PostgreSQL schema
- Recharts
- Sonner
- React Hook Form + Zod

## Project Structure

```text
src/
  app/
    api/auth/[...auth]/route.ts
    auth/*
    dashboard/*
    learn/*
    onboarding/*
  components/
    brand/*
    ui/*
  features/
    admin/*
    auth/*
    billing/*
    dashboard/*
    learn/*
    landing/*
    notes/*
    playlists/*
    sessions/*
    telemetry/*
  lib/
    auth/*
    demo-data.ts
    env.ts
    prisma.ts
    server-url.ts
  site-config.ts
prisma/
  schema.prisma
  seed.ts
```

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example env file:

```bash
cp .env.example .env.local
```

3. Fill the required variables.

Minimum local setup:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

Optional providers:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `LIFECYCLE_JOB_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MENTOR_PRO`
- `STRIPE_PRICE_HIRING_SPRINT`
- `NEXT_PUBLIC_SENTRY_DSN`

Optional Sentry source-map upload:

- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

## Database

This project is designed for Neon/Postgres through Prisma.

Generate the Prisma client:

```bash
pnpm prisma:generate
```

Create a local migration:

```bash
pnpm prisma:migrate
```

Seed starter content:

```bash
pnpm prisma:seed
```

## Development

Run the app:

```bash
pnpm dev
```

Validation commands:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm pricing:verify
```

Stripe tooling:

```bash
pnpm pricing:sync
pnpm pricing:verify
pnpm stripe-webhooks
```

## Observability

- Sentry is wired through `next.config.ts`, `src/instrumentation.ts`, `src/instrumentation-client.ts` and `src/app/global-error.tsx`
- the SDK stays dormant until `NEXT_PUBLIC_SENTRY_DSN` is configured
- source-map upload is only useful when `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` are also present

## Lifecycle Emails

- Resend is wired server-side through `src/lib/resend.ts` and `src/features/emails/lifecycle-email.ts`
- React Email templates live in `emails/` with a shared layout similar to the pattern used in Jobio
- run `pnpm email` to preview templates locally on `http://localhost:3030`
- onboarding can send a localized welcome email when `RESEND_API_KEY` is configured
- review-due reminders can be triggered through `GET /api/jobs/review-due-reminders`
- protect that route with `Authorization: Bearer $LIFECYCLE_JOB_SECRET`
- users can disable lifecycle emails from `/dashboard/settings`

## Auth Notes

- Better Auth is exposed through `src/app/api/auth/[...auth]/route.ts`
- email/password auth is enabled by default
- GitHub and Google buttons only appear when the corresponding OAuth credentials are configured
- protected routes redirect unauthenticated users to `/auth/signin`

## Product Notes

The product is no longer in a "foundation plus demo dashboard" phase.

What is already real:

- auth, onboarding and settings
- localized content queries through Prisma
- dashboard, progress, review and mock read models
- `dashboard/learn` as the authenticated learning workspace, with public `learn` kept as a teaser/acquisition surface
- session creation, attempts, scoring and manual review
- notes, bookmarks and playlists
- admin content operations with editorial quality signals, freshness review queue and duplicate-prompt watch
- Stripe billing and entitlements
- lifecycle emails, telemetry and Sentry wiring

What remains as the active roadmap:

- finish the last `demo-data` residues on authenticated surfaces
- deepen `learn` with richer micro-exercises, prerequisites and adaptive follow-up flows
- add learning signals beyond attempts alone and exploit them more deeply in recommendations
- extend admin QA with bulk freshness / dedup / editorial operations
- continue the editorial scale-up and QA workflow for the `learn` program
