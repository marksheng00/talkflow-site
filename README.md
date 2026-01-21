## TalkFlow marketing site

Next.js (App Router, TypeScript) + Tailwind v4 site with a Roadmap page that supports submissions, voting, and acceleration backed by Supabase (with mock fallback for local preview).

### Getting started

```bash
cd talkflow-site
npm install
npm run dev
# visit http://localhost:3000
```

### Environment

Create a `.env.local` with:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
# For server-side writes (recommended)
SUPABASE_SERVICE_ROLE_KEY=...
```

If these are missing the Roadmap page falls back to in-memory demo data so the UX still works.

You can copy `.env.local.example` and fill in your Supabase keys.

### Supabase schema (SQL)

```sql
create table public.roadmap_items (
  id uuid primary key,
  title text not null,
  description text,
  status text default 'researching',
  category text,
  eta text,
  upvotes int default 0,
  downvotes int default 0,
  accelerations int default 0,
  created_at timestamptz default timezone('utc', now())
);

alter table public.roadmap_items enable row level security;
create policy "roadmap read" on public.roadmap_items for select using (true);
create policy "roadmap insert" on public.roadmap_items for insert with check (true);
create policy "roadmap update" on public.roadmap_items for update using (true);
```

Use the service role key in the server API routes to bypass RLS while keeping the key server-side only.

Files to speed up setup:
- `supabase/schema.sql` — same schema as above, ready to run in the SQL editor.
- `supabase/seed.sql` — optional sample items for UI preview.

### Key routes and modules

- `src/app/page.tsx`: Marketing homepage redesign.
- `src/app/roadmap/page.tsx`: Roadmap UI with submission, accelerate, and vote flows.
- `src/lib/roadmap.ts`: Supabase-backed data helpers with mock fallback.
- API endpoints:  
  - `GET/POST /api/roadmap/items`  
  - `POST /api/roadmap/items/[id]/vote`  
  - `POST /api/roadmap/items/[id]/accelerate`

### Notes

- Design system uses CSS variables in `globals.css` and the `section-shell` utility for consistent spacing.
- Header/footers live in `src/components/layout`.
