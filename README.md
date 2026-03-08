# React Mentor

React Mentor is a branded interview-prep SaaS foundation for React, React Native and TypeScript candidates.

The current MVP includes:

- a premium landing page with a clear product narrative
- Better Auth wired to Prisma for email/password and optional social login
- a protected dashboard with a retractable sidebar
- dedicated pages for modules, progress, review and mock interviews
- a Prisma schema designed for modules, skills, questions, attempts and spaced review
- demo content in the UI so the product feels real before the admin/content layer exists

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
  components/
    brand/*
    ui/*
  features/
    auth/*
    dashboard/*
    landing/*
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

The dashboard currently uses demo UI content, while the auth and database foundations are real.

That gives you a pragmatic split:

- the branding, UX and route architecture are production-shaped now
- the Prisma schema is ready for real content and progression data
- the next logical layer is the admin/content workflow plus server actions for attempts, sessions and progress aggregation
