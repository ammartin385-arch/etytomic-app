create table if not exists public.reminder_delivery_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reminder_type text not null check (reminder_type in ('daily', 'weekly', 'monthly')),
  log_key text unique not null,
  sent_at timestamp with time zone default now()
);

alter table public.reminder_delivery_log enable row level security;

create policy "Users can view their own reminder delivery log"
on public.reminder_delivery_log
for select
using (auth.uid() = user_id);
