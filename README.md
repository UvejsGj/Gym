# Gym Progress Tracker

Production-style Gym Progress Tracker built with:
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase auth/database with RLS
- Recharts for analytics
- React Hook Form + Zod

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
