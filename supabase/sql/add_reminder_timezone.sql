alter table public.reminder_preferences
add column if not exists timezone text default 'UTC';

-- Existing preferences need a timezone once. New saves from the app will use the browser timezone.
-- For Anna's current Eastern-time test account, this sets any old UTC rows to Eastern time.
update public.reminder_preferences
set timezone = 'America/New_York'
where timezone is null or timezone = 'UTC';
