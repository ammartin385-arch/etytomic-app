-- Journal privacy hardening.
-- Users own and control their own journal entries.

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text,
  prompt text,
  response text not null,
  created_at timestamp with time zone default now()
);

alter table public.journal_entries
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists category text,
  add column if not exists prompt text,
  add column if not exists response text,
  add column if not exists created_at timestamp with time zone default now();

alter table public.journal_entries
  alter column user_id set not null,
  alter column response set not null;

create index if not exists journal_entries_user_id_created_at_idx
on public.journal_entries (user_id, created_at desc);

alter table public.journal_entries enable row level security;

drop policy if exists "Users can view their own journal entries" on public.journal_entries;
drop policy if exists "Users can create their own journal entries" on public.journal_entries;
drop policy if exists "Users can update their own journal entries" on public.journal_entries;
drop policy if exists "Users can delete their own journal entries" on public.journal_entries;

create policy "Users can view their own journal entries"
on public.journal_entries
for select
using (auth.uid() = user_id);

create policy "Users can create their own journal entries"
on public.journal_entries
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
on public.journal_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
on public.journal_entries
for delete
using (auth.uid() = user_id);
