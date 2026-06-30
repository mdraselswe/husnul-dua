# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

হুসনুল দুআ (Husnul Dua) is a Bengali-language Islamic dua/dhikr search PWA. Users search duas by text or tag; each dua stores Arabic, transliteration, Bengali, and optional English. Most UI strings and seed data are in Bengali.

## Commands

```bash
npm run dev      # dev server (Next.js with --webpack, not Turbopack)
npm run build    # prisma generate && next build --webpack
npm run lint     # eslint
npm run seed     # tsx prisma/seed.ts — upserts sample duas
npx prisma db push     # apply schema to DB (no migrations dir; uses db push)
npx prisma studio      # browse DB
```

No test suite exists.

## Architecture

- **Next.js 16 App Router** + React 19 + TypeScript + Tailwind v4. `@/*` path alias maps to repo root.
- **Single data model: `Dua`** (`prisma/schema.prisma`). Tags are stored as a **comma-separated string** on each dua, not a relation. Search matches with `contains` against that string, and `/api/duas/tags` derives the unique tag list by splitting every dua's `tags` field in app code.
- **API routes**: `app/api/duas/route.ts` (GET search by `q`/`tag`/`category`, POST create) and `app/api/duas/tags/route.ts` (GET unique tags). Pages (`app/page.tsx`, `app/add/page.tsx`) are client components fetching these routes.
- **PWA** via `next-pwa` (`next.config.ts`), disabled in development, outputs to `public/`.

## Prisma — important gotchas

- **Generated client lives in `lib/prisma/`** (custom `output`, not `node_modules`). It is committed. Always import the singleton from `@/lib/prisma-client` — never instantiate `PrismaClient` directly in app code (seed script is the exception).
- `lib/prisma-client.ts` rewrites `DATABASE_URL`: defaults to absolute `prisma/dev.db` if unset, and converts `file:./` relative paths to absolute (Next.js needs this for SQLite).
- **SQLite locally, PostgreSQL in production.** The committed `schema.prisma` uses `provider = "sqlite"`. Deploying to Postgres requires changing the provider to `postgresql` and re-running `prisma generate && prisma db push` against the production `DATABASE_URL`. `schema.sqlite.prisma` is a backup copy of the SQLite schema.
- `mode: "insensitive"` is used in the search query — a no-op on SQLite, effective only on PostgreSQL.
- After editing `schema.prisma`, run `npx prisma generate` to refresh `lib/prisma/`.

## Deployment

Targets Vercel (`vercel.json`). Production needs an external PostgreSQL DB (Supabase, etc.) — SQLite does not work on serverless platforms. Set `DATABASE_URL` env var. See `DEPLOYMENT.md`, `PRODUCTION-SETUP.md`, and the various `*-FIX.md` files for connection-string and Supabase specifics.
