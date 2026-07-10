create extension if not exists pgcrypto;

create table if not exists public.lecture_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  lecture_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists lecture_notes_created_at_idx
  on public.lecture_notes (created_at desc);

alter table public.lecture_notes enable row level security;

drop policy if exists "Allow anonymous insert lecture notes" on public.lecture_notes;
drop policy if exists "Allow anonymous read lecture notes" on public.lecture_notes;
drop policy if exists "Allow anonymous delete lecture notes" on public.lecture_notes;

create policy "Allow anonymous insert lecture notes"
  on public.lecture_notes
  for insert
  to anon
  with check (true);

create policy "Allow anonymous read lecture notes"
  on public.lecture_notes
  for select
  to anon
  using (true);

create policy "Allow anonymous delete lecture notes"
  on public.lecture_notes
  for delete
  to anon
  using (true);
