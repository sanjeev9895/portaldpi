-- ============================================================================
-- Add ONLY the Daily Work Status Report table to an existing Supabase project.
-- Run this in the Supabase SQL Editor if you already ran supabase_setup.sql
-- earlier and just need the new table. (Safe to re-run.)
-- ============================================================================

create table if not exists public.daily_work_reports (
    id             bigserial primary key,
    resource_name  varchar(255) not null,
    report_date    varchar(50),
    team           varchar(255),
    day            varchar(50),
    ongoing_tasks  text default '[]',   -- JSON array of {category, task_description, due_date, status}
    tomorrow_tasks text default '[]',   -- JSON array of {category, task_description, due_date, status}
    entered_by     varchar(255),
    entered_time   varchar(100)
);

alter table public.daily_work_reports enable row level security;

drop policy if exists "vz_public_all" on public.daily_work_reports;
create policy "vz_public_all"
  on public.daily_work_reports
  for all
  to anon, authenticated
  using (true)
  with check (true);
