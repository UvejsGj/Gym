# Gym Progress Tracker

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Production-style Gym Progress Tracker built with:
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase auth/database with RLS
- Recharts for analytics
- React Hook Form + Zod

A modern, responsive full-stack web app to track workouts, sets, volume, body weight, and personal records over time with user-scoped secure data access.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase Setup

1. Create a Supabase project.
2. Copy URL and anon key into `.env.local`.
3. Run SQL in Supabase SQL editor:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
4. Optionally run `supabase/seed.sql` after login to add starter exercises.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
