-- ============================================================================
-- Vizhuthugal Dashboard — Supabase setup (single file)
-- ============================================================================
-- Run this ONCE in the Supabase SQL Editor:
--   Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
--
-- It is idempotent (safe to re-run). It creates:
--   1. All data tables
--   2. Row Level Security (RLS) policies
--   3. A private users table + pgcrypto-based auth functions (register/login/reset)
--   4. Demo users and sample data
--
-- The frontend talks to Supabase directly using the project's anon key.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Users (authentication). Password hashes live here; the table is locked down
-- by RLS and is only reachable through the SECURITY DEFINER functions below.
create table if not exists public.users (
    id            bigserial primary key,
    name          varchar(255) not null,
    phone         varchar(50)  not null,
    email         varchar(255) not null unique,
    password_hash varchar(255) not null,
    role          varchar(50)  default 'employee'
);

create table if not exists public.employees (
    id           bigserial primary key,
    name         varchar(255) not null,
    email        varchar(255) not null unique,
    contact      varchar(50)  not null,
    department   varchar(100) not null,
    role         varchar(100) not null,
    joining_date varchar(50)  not null
);

create table if not exists public.attendance (
    id            bigserial primary key,
    employee_name varchar(255) not null,
    check_in      varchar(100) not null,
    check_out     varchar(100),
    work_done     text
);

create table if not exists public.core_engagements (
    id                    bigserial primary key,
    district              varchar(100) not null,
    block                 varchar(100) not null,
    school_name           varchar(255) not null,
    school_type           varchar(100),
    school_category       varchar(100),
    engagement_type       varchar(100),
    other_engagement_type varchar(255),
    alumni_count          integer default 0,
    amount_collected      integer default 0,
    proof_files           text default '[]',
    important_attendees   text,
    remarks               text,
    entered_by            varchar(255),
    entered_time          varchar(100)
);

create table if not exists public.whatsapp_engagements (
    id                       bigserial primary key,
    school_name              varchar(255) not null,
    district                 varchar(100),
    block                    varchar(100),
    school_type              varchar(100),
    school_category          varchar(100),
    group_formed             varchar(10) default 'Yes',
    group_link               varchar(500),
    member_count             integer default 0,
    last_shared_message      text,
    last_shared_message_date varchar(50),
    last_msg_responses       text,
    activity_status          varchar(50),
    changes_count            integer default 0,
    history_json             text default '[]',
    entered_by               varchar(255),
    entered_time             varchar(100)
);

create table if not exists public.school_communities (
    id                      bigserial primary key,
    district                varchar(100) not null,
    block                   varchar(100) not null,
    school_name             varchar(255) not null,
    school_type             varchar(100),
    school_category         varchar(100),
    hm_supportive           varchar(10) default 'No',
    smc_alumni_count        integer default 0,
    ambassador_alumni_count integer default 0,
    approach_taken          varchar(255),
    period_started          varchar(50),
    period_ended            varchar(50),
    mobilized_count         integer default 0,
    mobilized_status        varchar(10),
    alumni_group_platforms  text default '[]',
    other_platform          varchar(255),
    platform_link           varchar(500),
    risk_challenge          text,
    mitigation_taken        text,
    take_back               text,
    proof_files             text default '[]',
    media_content           text,
    celebrated_status       varchar(10) default 'No',
    entered_by              varchar(255),
    entered_time            varchar(100)
);

create table if not exists public.core_team_formations (
    id                        bigserial primary key,
    district                  varchar(100) not null,
    block                     varchar(100) not null,
    school_name               varchar(255) not null,
    school_type               varchar(100),
    school_category           varchar(100),
    hm_supportive             varchar(10) default 'No',
    smc_alumni_support        varchar(10) default 'No',
    ambassador_alumni_support varchar(10) default 'No',
    approach_taken            varchar(255),
    period_started            varchar(50),
    period_ended              varchar(50),
    core_team_count           integer default 0,
    core_team_status          varchar(50),
    core_team_platforms       text default '[]',
    other_platform            varchar(255),
    platform_link             varchar(500),
    risk_challenge            text,
    mitigation_taken          text,
    take_back                 text,
    proof_files               text default '[]',
    media_content             text,
    celebrated_status         varchar(10) default 'No',
    entered_by                varchar(255),
    entered_time              varchar(100)
);

-- ============================================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================================
-- Data tables: the dashboard is an internal tool, so we allow the public
-- (anon) key full access. Tighten these later if you add per-user ownership.
do $$
declare t text;
begin
  foreach t in array array[
    'employees','attendance','core_engagements',
    'whatsapp_engagements','school_communities','core_team_formations'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "vz_public_all" on public.%I;', t);
    execute format(
      'create policy "vz_public_all" on public.%I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- users table: RLS on with NO policies => no direct client access at all.
-- The auth functions below are SECURITY DEFINER and bypass RLS safely.
alter table public.users enable row level security;

-- ============================================================================
-- 3. AUTH FUNCTIONS (pgcrypto / bcrypt)
-- ============================================================================
create or replace function public.register_user(
    p_name text,
    p_phone text,
    p_email text,
    p_password text,
    p_role text default 'employee'
)
returns table(id bigint, name text, phone text, email text, role text)
language plpgsql
security definer
set search_path = public, extensions
as $$
#variable_conflict use_column
declare
    v_email text := lower(trim(p_email));
    v_role  text := coalesce(nullif(lower(trim(p_role)), ''), 'employee');
begin
    if exists (select 1 from public.users u where u.email = v_email) then
        raise exception 'Email is already registered';
    end if;

    insert into public.users(name, phone, email, password_hash, role)
    values (p_name, p_phone, v_email, crypt(p_password, gen_salt('bf')), v_role);

    -- Mirror the account into the employees directory.
    insert into public.employees(name, email, contact, department, role, joining_date)
    values (p_name, v_email, p_phone, 'General', initcap(v_role), current_date::text)
    on conflict (email) do nothing;

    return query
        select u.id, u.name::text, u.phone::text, u.email::text, u.role::text
        from public.users u
        where u.email = v_email;
end;
$$;

create or replace function public.login_user(p_email text, p_password text)
returns table(id bigint, name text, phone text, email text, role text)
language plpgsql
security definer
set search_path = public, extensions
as $$
#variable_conflict use_column
declare
    v_email text := lower(trim(p_email));
begin
    return query
        select u.id, u.name::text, u.phone::text, u.email::text, u.role::text
        from public.users u
        where u.email = v_email
          and u.password_hash = crypt(p_password, u.password_hash);
end;
$$;

create or replace function public.reset_user_password(p_email text, p_new_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    v_email text := lower(trim(p_email));
    v_count int;
begin
    update public.users
       set password_hash = crypt(p_new_password, gen_salt('bf'))
     where email = v_email;
    get diagnostics v_count = row_count;
    if v_count = 0 then
        raise exception 'No account found for that email';
    end if;
    return true;
end;
$$;

-- Allow the public/anon key to call only these functions (not the table).
grant execute on function public.register_user(text, text, text, text, text) to anon, authenticated;
grant execute on function public.login_user(text, text) to anon, authenticated;
grant execute on function public.reset_user_password(text, text) to anon, authenticated;

-- ============================================================================
-- 4. DEMO DATA (idempotent)
-- ============================================================================

-- Demo users (also creates matching employees). Passwords are hashed.
do $$
begin
    if not exists (select 1 from public.users where email = 'admin@gmail.com') then
        perform public.register_user('State Admin', '9876543210', 'admin@gmail.com', 'admin1', 'admin');
    end if;
    if not exists (select 1 from public.users where email = 'manager@gmail.com') then
        perform public.register_user('Manager User', '9876543211', 'manager@gmail.com', 'manager1', 'manager');
    end if;
    if not exists (select 1 from public.users where email = 'employee@gmail.com') then
        perform public.register_user('Employee User', '9876543212', 'employee@gmail.com', 'employee1', 'employee');
    end if;
end $$;

-- Sample attendance (only if empty)
insert into public.attendance (employee_name, check_in, check_out, work_done)
select * from (values
    ('State Admin',   '2026-06-05 09:00:00', '2026-06-05 18:00:00', 'Conducted planning and state level reviews.'),
    ('Manager User',  '2026-06-05 09:30:00', '2026-06-05 17:30:00', 'Field coordination and school visits.'),
    ('Employee User', '2026-06-05 09:15:00', '2026-06-05 18:15:00', 'WhatsApp group engagement updates and support.')
) as v(employee_name, check_in, check_out, work_done)
where not exists (select 1 from public.attendance);

-- Sample WhatsApp engagements (only if empty)
insert into public.whatsapp_engagements
    (school_name, district, block, school_type, school_category, group_formed, group_link,
     member_count, last_shared_message, last_shared_message_date, last_msg_responses,
     activity_status, changes_count, history_json, entered_by, entered_time)
select * from (values
    ('Govt Hr Sec School, Madurai', 'Madurai', 'Madurai East', 'High Sec School', 'Centinary School',
     'Yes', 'https://chat.whatsapp.com/GHSSAlumniMadurai2025', 245,
     'Invitation for centenary fundraising meeting on June 15th.', '2026-06-01',
     '12 members clicked join, 5 sent RSVPs directly.', 'High', 0, '[]', 'Admin', '2026-06-01, 10:00:00 AM'),
    ('St. Mary''s School, Trichy', 'Tiruchirappalli', 'Thiruverumbur', 'Middle School', 'Vetri Palligal School',
     'Yes', 'https://chat.whatsapp.com/StMarysAlumniTrichy', 480,
     'Announced the new SMC mentoring session timetable.', '2026-06-02',
     '22 members confirmed availability, 2 asked for rescheduling.', 'High', 0, '[]', 'Manager', '2026-06-02, 11:30:00 AM')
) as v(school_name, district, block, school_type, school_category, group_formed, group_link,
       member_count, last_shared_message, last_shared_message_date, last_msg_responses,
       activity_status, changes_count, history_json, entered_by, entered_time)
where not exists (select 1 from public.whatsapp_engagements);

-- Sample core engagements (only if empty)
insert into public.core_engagements
    (district, block, school_name, school_type, school_category, engagement_type,
     alumni_count, amount_collected, proof_files, important_attendees, remarks, entered_by, entered_time)
select * from (values
    ('Madurai', 'Madurai East', 'Govt Hr Sec School, Madurai', 'High Sec School', 'Centinary School',
     'Alumni Meet', 45, 25000, '[]', 'District Collector, School Headmaster, SMC President',
     'Discussed centenary celebration funding and sports ground expansion plans.', 'Admin', '2026-06-01, 10:00:00 AM'),
    ('Salem', 'Salem South', 'Municipal Boys High School', 'High School', 'Career Guidance',
     'Others', 30, 120000, '[]', 'Alumni Association President, local business sponsors',
     'Raised funds to upgrade classroom projectors and install high-speed internet.', 'Karthik', '2026-06-03, 04:15:00 PM')
) as v(district, block, school_name, school_type, school_category, engagement_type,
       alumni_count, amount_collected, proof_files, important_attendees, remarks, entered_by, entered_time)
where not exists (select 1 from public.core_engagements);

-- Sample school communities (only if empty)
insert into public.school_communities
    (district, block, school_name, school_type, school_category, hm_supportive, smc_alumni_count,
     ambassador_alumni_count, approach_taken, period_started, period_ended, mobilized_count, mobilized_status,
     alumni_group_platforms, other_platform, platform_link, risk_challenge, mitigation_taken, take_back,
     proof_files, media_content, celebrated_status, entered_by, entered_time)
select * from (values
    ('Madurai', 'Madurai East', 'Govt Hr Sec School, Madurai', 'High Sec School', 'Centinary School',
     'Yes', 15, 5, 'Direct HM visit', '2026-05-01', '2026-05-15', 650, 'Yes',
     '["WhatsApp", "Telegram"]', '', 'https://chat.whatsapp.com/GHSSAlumni2025',
     'Coordination with remote alumni', 'Assigned block leaders', 'Need regular updates',
     '[]', 'Inaugural event photos', 'Yes', 'State Admin', '2026-06-01, 10:00:00 AM')
) as v(district, block, school_name, school_type, school_category, hm_supportive, smc_alumni_count,
       ambassador_alumni_count, approach_taken, period_started, period_ended, mobilized_count, mobilized_status,
       alumni_group_platforms, other_platform, platform_link, risk_challenge, mitigation_taken, take_back,
       proof_files, media_content, celebrated_status, entered_by, entered_time)
where not exists (select 1 from public.school_communities);

-- Sample core team formations (only if empty)
insert into public.core_team_formations
    (district, block, school_name, school_type, school_category, hm_supportive, smc_alumni_support,
     ambassador_alumni_support, approach_taken, period_started, period_ended, core_team_count, core_team_status,
     core_team_platforms, other_platform, platform_link, risk_challenge, mitigation_taken, take_back,
     proof_files, media_content, celebrated_status, entered_by, entered_time)
select * from (values
    ('Madurai', 'Madurai East', 'Govt Hr Sec School, Madurai', 'High Sec School', 'Centinary School',
     'Yes', 'Yes', 'Yes', 'Core group meeting', '2026-05-15', '2026-05-30', 28, 'Formed',
     '["WhatsApp", "Telegram"]', '', 'https://chat.whatsapp.com/sample-core-team',
     'Busy schedules', 'Weekend virtual syncs', 'Excited lead organizers',
     '[]', '', 'Yes', 'State Admin', '2026-06-01, 10:00:00 AM')
) as v(district, block, school_name, school_type, school_category, hm_supportive, smc_alumni_support,
       ambassador_alumni_support, approach_taken, period_started, period_ended, core_team_count, core_team_status,
       core_team_platforms, other_platform, platform_link, risk_challenge, mitigation_taken, take_back,
       proof_files, media_content, celebrated_status, entered_by, entered_time)
where not exists (select 1 from public.core_team_formations);

-- ============================================================================
-- Done. Demo logins:  admin@gmail.com / admin1
--                     manager@gmail.com / manager1
--                     employee@gmail.com / employee1
-- =================