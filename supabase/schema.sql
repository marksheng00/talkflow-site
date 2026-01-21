-- Schema for roadmap items used by the TalkFlow site
create extension if not exists "uuid-ossp";

create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'researching',
  category text,
  eta text,
  upvotes int default 0,
  downvotes int default 0,
  accelerations int default 0,
  created_at timestamptz default timezone('utc', now()),
  start_date date,
  target_date date,
  progress int default 0,
  cover_image text,
  detailed_content text
);

alter table public.roadmap_items enable row level security;

create policy "roadmap read" on public.roadmap_items for select using (true);
create policy "roadmap insert" on public.roadmap_items for insert with check (true);
create policy "roadmap update" on public.roadmap_items for update using (true);
