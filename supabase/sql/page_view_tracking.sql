-- Track aggregate page activity for the private admin dashboard.
-- This stores page names and anonymous visitor ids, not assessment answers or journal text.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  visitor_id text,
  page text not null,
  path text,
  referrer text,
  user_agent text,
  created_at timestamp with time zone not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_page_created_at_idx
  on public.page_views (page, created_at desc);

create index if not exists page_views_user_id_idx
  on public.page_views (user_id);

create index if not exists page_views_visitor_id_idx
  on public.page_views (visitor_id);

alter table public.page_views enable row level security;

drop policy if exists "Visitors can create page views"
  on public.page_views;

create policy "Visitors can create page views"
  on public.page_views
  for insert
  to anon, authenticated
  with check (
    page <> ''
    and (user_id is null or auth.uid() = user_id)
  );

-- Aggregate-only admin usage metrics.
-- This function never returns journal text, prompts, assessment answers,
-- user emails, user ids, or other user-level records.

create or replace function public.admin_usage_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  caller_email text;
  result jsonb;
begin
  select lower(users.email)
  into caller_email
  from auth.users as users
  where users.id = auth.uid();

  if caller_email is null
     or caller_email <> 'am.martin385@gmail.com' then
    raise exception 'Admin access denied'
      using errcode = '42501';
  end if;

  with
  date_series as (
    select generate_series(
      current_date - interval '29 days',
      current_date,
      interval '1 day'
    )::date as day
  ),
  assessment_daily as (
    select created_at::date as day, count(*)::integer as count
    from public.assessment_results
    where created_at >= current_date - interval '29 days'
    group by created_at::date
  ),
  user_daily as (
    select created_at::date as day, count(*)::integer as count
    from public.profiles
    where created_at >= current_date - interval '29 days'
    group by created_at::date
  ),
  page_view_daily as (
    select created_at::date as day, count(*)::integer as count
    from public.page_views
    where created_at >= current_date - interval '29 days'
    group by created_at::date
  ),
  assessment_chart as (
    select jsonb_agg(
      jsonb_build_object(
        'date', to_char(date_series.day, 'YYYY-MM-DD'),
        'count', coalesce(assessment_daily.count, 0)
      )
      order by date_series.day
    ) as data
    from date_series
    left join assessment_daily using (day)
  ),
  user_chart as (
    select jsonb_agg(
      jsonb_build_object(
        'date', to_char(date_series.day, 'YYYY-MM-DD'),
        'count', coalesce(user_daily.count, 0)
      )
      order by date_series.day
    ) as data
    from date_series
    left join user_daily using (day)
  ),
  page_view_chart as (
    select jsonb_agg(
      jsonb_build_object(
        'date', to_char(date_series.day, 'YYYY-MM-DD'),
        'count', coalesce(page_view_daily.count, 0)
      )
      order by date_series.day
    ) as data
    from date_series
    left join page_view_daily using (day)
  ),
  top_pages as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'page', page,
          'views', view_count,
          'unique_viewers', unique_viewers
        )
        order by view_count desc
      ),
      '[]'::jsonb
    ) as data
    from (
      select
        page,
        count(*)::integer as view_count,
        count(distinct coalesce(user_id::text, visitor_id))::integer as unique_viewers
      from public.page_views
      where created_at >= now() - interval '30 days'
      group by page
      order by view_count desc
      limit 8
    ) ranked_pages
  )
  select jsonb_build_object(
    'total_registered_users',
      (select count(*) from public.profiles),
    'new_users_last_7_days',
      (select count(*) from public.profiles
       where created_at >= now() - interval '7 days'),
    'new_users_last_30_days',
      (select count(*) from public.profiles
       where created_at >= now() - interval '30 days'),
    'total_page_views',
      (select count(*) from public.page_views),
    'unique_page_viewers',
      (select count(distinct coalesce(user_id::text, visitor_id)) from public.page_views),
    'page_views_last_7_days',
      (select count(*) from public.page_views
       where created_at >= now() - interval '7 days'),
    'page_views_last_30_days',
      (select count(*) from public.page_views
       where created_at >= now() - interval '30 days'),
    'unique_page_viewers_last_30_days',
      (select count(distinct coalesce(user_id::text, visitor_id))
       from public.page_views
       where created_at >= now() - interval '30 days'),
    'unique_assessment_users',
      (select count(distinct user_id) from public.assessment_results),
    'signup_to_assessment_rate',
      (select case
        when count(*) = 0 then 0
        else round(
          ((select count(distinct user_id) from public.assessment_results)::numeric
          / count(*)::numeric) * 100,
          1
        )
      end
      from public.profiles),
    'repeat_assessment_users',
      (select count(*)
       from (
         select user_id
         from public.assessment_results
         group by user_id
         having count(*) >= 2
       ) repeat_users),
    'average_assessments_per_assessment_user',
      (select case
        when count(distinct user_id) = 0 then 0
        else round(count(*)::numeric / count(distinct user_id)::numeric, 2)
      end
      from public.assessment_results),
    'total_assessments',
      (select count(*) from public.assessment_results),
    'assessments_last_7_days',
      (select count(*) from public.assessment_results
       where created_at >= now() - interval '7 days'),
    'assessments_last_30_days',
      (select count(*) from public.assessment_results
       where created_at >= now() - interval '30 days'),
    'premium_active_users',
      (select count(*) from public.profiles
       where lower(coalesce(subscription_status, 'free')) = 'active'),
    'premium_conversion_rate',
      (select case
        when (select count(distinct user_id) from public.assessment_results) = 0 then 0
        else round(
          ((select count(*) from public.profiles
            where lower(coalesce(subscription_status, 'free')) = 'active')::numeric
          / (select count(distinct user_id) from public.assessment_results)::numeric) * 100,
          1
        )
      end),
    'free_users',
      (select count(*) from public.profiles
       where lower(coalesce(subscription_status, 'free')) <> 'active'),
    'total_journal_entries',
      (select count(*) from public.journal_entries),
    'journal_entries_last_7_days',
      (select count(*) from public.journal_entries
       where created_at >= now() - interval '7 days'),
    'journal_users',
      (select count(distinct user_id) from public.journal_entries),
    'reminder_opt_ins',
      (select count(distinct user_id)
       from public.reminder_preferences
       where coalesce(daily_enabled, false)
          or coalesce(weekly_enabled, false)
          or coalesce(monthly_enabled, false)),
    'daily_reminder_opt_ins',
      (select count(distinct user_id)
       from public.reminder_preferences
       where coalesce(daily_enabled, false)),
    'weekly_reminder_opt_ins',
      (select count(distinct user_id)
       from public.reminder_preferences
       where coalesce(weekly_enabled, false)),
    'monthly_reminder_opt_ins',
      (select count(distinct user_id)
       from public.reminder_preferences
       where coalesce(monthly_enabled, false)),
    'assessments_by_day',
      coalesce((select data from assessment_chart), '[]'::jsonb),
    'new_users_by_day',
      coalesce((select data from user_chart), '[]'::jsonb),
    'page_views_by_day',
      coalesce((select data from page_view_chart), '[]'::jsonb),
    'top_pages',
      coalesce((select data from top_pages), '[]'::jsonb),
    'generated_at',
      now()
  )
  into result;

  return result;
end;
$$;

revoke all on function public.admin_usage_metrics() from public;
revoke all on function public.admin_usage_metrics() from anon;
grant execute on function public.admin_usage_metrics() to authenticated;
