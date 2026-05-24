-- Automatically create a public profile row when a Supabase Auth user signs up.
-- Run this once in the Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text,
  subscription_status text default 'free',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists role text,
  add column if not exists subscription_status text default 'free',
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    email = new.email,
    full_name = coalesce(
      public.profiles.full_name,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name'
    ),
    updated_at = now()
  where id = new.id;

  if not found then
    insert into public.profiles (
      id,
      email,
      full_name,
      subscription_status,
      created_at,
      updated_at
    )
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'display_name'
      ),
      'free',
      now(),
      now()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

-- Backfill missing profiles for users who already signed up before this trigger existed.
insert into public.profiles (
  id,
  email,
  full_name,
  subscription_status,
  created_at,
  updated_at
)
select
  users.id,
  users.email,
  coalesce(
    users.raw_user_meta_data->>'full_name',
    users.raw_user_meta_data->>'name',
    users.raw_user_meta_data->>'display_name'
  ),
  'free',
  now(),
  now()
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where profiles.id is null;

-- Keep existing profile emails/full names in sync without changing subscription status.
update public.profiles as profiles
set
  email = users.email,
  full_name = coalesce(
    profiles.full_name,
    users.raw_user_meta_data->>'full_name',
    users.raw_user_meta_data->>'name',
    users.raw_user_meta_data->>'display_name'
  ),
  updated_at = now()
from auth.users as users
where profiles.id = users.id;

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
