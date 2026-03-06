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
