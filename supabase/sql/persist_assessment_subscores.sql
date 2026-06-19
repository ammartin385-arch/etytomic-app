-- Preserve the exact score inputs used by the existing Premium Results logic.
-- The snapshot stores aggregate scores and all 11 named subscores without
-- persisting private assessment answers.

alter table public.assessment_results
  add column if not exists score_snapshot jsonb;

drop policy if exists "Users can read their assessment results"
  on public.assessment_results;
create policy "Users can read their assessment results"
  on public.assessment_results
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their assessment results"
  on public.assessment_results;
create policy "Users can create their assessment results"
  on public.assessment_results
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their assessment results"
  on public.assessment_results;
create policy "Users can delete their assessment results"
  on public.assessment_results
  for delete
  to authenticated
  using (auth.uid() = user_id);

comment on column public.assessment_results.score_snapshot is
  'Versioned aggregate score snapshot containing overall, domain, resistance, 11 subscore values, and selected guidance profile metadata. Does not contain assessment answers.';
