alter table public.reminder_preferences
  add column if not exists reminder_channel text default 'email',
  add column if not exists phone_number text,
  add column if not exists sms_opt_in boolean default false,
  add column if not exists sms_consent_at timestamp with time zone,
  add column if not exists sms_consent_text text,
  add column if not exists sms_opted_out_at timestamp with time zone;

alter table public.reminder_preferences
  drop constraint if exists reminder_preferences_reminder_channel_check;

alter table public.reminder_preferences
  add constraint reminder_preferences_reminder_channel_check
  check (reminder_channel in ('email', 'sms', 'both'));

alter table public.reminder_delivery_log
  add column if not exists channel text default 'email';

alter table public.reminder_delivery_log
  drop constraint if exists reminder_delivery_log_channel_check;

alter table public.reminder_delivery_log
  add constraint reminder_delivery_log_channel_check
  check (channel in ('email', 'sms'));
