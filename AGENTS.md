# React Mentor Guidance

- Product scope: interview-prep SaaS for React, React Native, and TypeScript.
- Start with [README.md](/Users/yoannandrieux/Projets/react-mentor/README.md), [package.json](/Users/yoannandrieux/Projets/react-mentor/package.json), and the nearest feature files before editing.
- Preserve the project split:
  - `src/app` for route composition and page entry points
  - `src/features` for feature logic and view models
  - `src/lib` for shared services and data access
  - `prisma` for schema, seed, and migrations
- The repo is on Next.js 16 and React 19. Avoid bringing in stale Next.js 15-era guidance.
- Prefer server components and server-side data loading. Keep client components small and interaction-focused.
- Use `pnpm` scripts from [package.json](/Users/yoannandrieux/Projets/react-mentor/package.json): `lint`, `typecheck`, `test:ci`, `build`, and `test:e2e:ci`.
- When touching dashboard, content, or session flows, read [prisma/schema.prisma](/Users/yoannandrieux/Projets/react-mentor/prisma/schema.prisma), [src/lib/content-repository.ts](/Users/yoannandrieux/Projets/react-mentor/src/lib/content-repository.ts), and the relevant contract or read-model file first.
- Keep localized UI copy mirrored in [src/i18n/messages/fr.ts](/Users/yoannandrieux/Projets/react-mentor/src/i18n/messages/fr.ts) and [src/i18n/messages/en.ts](/Users/yoannandrieux/Projets/react-mentor/src/i18n/messages/en.ts).
- For Prisma changes, update migrations, seed data, and affected tests together.
- Prefer Vitest in `__tests__/` for domain logic and Playwright in `e2e/` for user-facing flows.
