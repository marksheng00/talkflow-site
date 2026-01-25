-- Create changelog_releases table
create table if not exists changelog_releases (
  id uuid default gen_random_uuid() primary key,
  version text unique not null,
  publish_date timestamptz not null default now(),
  status text not null check (status in ('draft', 'published')) default 'draft',
  created_at timestamptz default now()
);

-- Show RLS policies for changelog_releases
alter table changelog_releases enable row level security;

-- Create changelog_items table
create table if not exists changelog_items (
  id uuid default gen_random_uuid() primary key,
  release_id uuid references changelog_releases(id) on delete cascade not null,
  type text not null check (type in ('feature', 'fix', 'improvement', 'perf')),
  description jsonb not null default '{}'::jsonb, -- Localized content: { "en": "...", "zh": "..." }
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- Show RLS policies for changelog_items
alter table changelog_items enable row level security;

-- Policy: Everyone can read published releases
create policy "Public releases are viewable by everyone"
  on changelog_releases for select
  using (status = 'published');

create policy "Public items are viewable by everyone"
  on changelog_items for select
  using (exists (
    select 1 from changelog_releases
    where changelog_releases.id = changelog_items.release_id
    and changelog_releases.status = 'published'
  ));

-- Policy: Admins can do everything (For MVP, we might allow full access for authenticated users if we assume only admins login, 
-- or use a specific email check. For now, let's assume a simplified "authenticated admin" policy or public read / service_role write).
-- Since we don't have a robust role system yet, we often skip RLS for service_role (Admin API) usage, 
-- but for Client-side Admin Dashboard, we need RLS.
-- Let's define a policy that allows everything for a specific hardcoded email or better, rely on Service Role for Admin Dashboard 
-- if we build it as Server Components or use Supabase Dashboard. 
-- BUT, user wants a custom Admin Dashboard.
-- Let's create a policy for "authenticated" users to read/write EVERYTHING for now, assuming only Admins are invited to this Supabase project.
-- OR better: check email in metadata.

-- For now, let's keep it simple: Authenticated users can CRUD. Public users can SELECT only published.
create policy "Auth users can CRUD releases"
  on changelog_releases for all
  using (auth.role() = 'authenticated');

create policy "Auth users can CRUD items"
  on changelog_items for all
  using (auth.role() = 'authenticated');
