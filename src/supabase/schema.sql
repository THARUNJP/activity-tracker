-- ============================================================
-- Activity Tracker - Final Schema (App-generated ULID)
-- ============================================================

-- =========================
-- ENUMS
-- =========================
create type public.activity_type as enum ('manual', 'system');
create type public.productivity_type as enum ('productive', 'leisure');
create type public.target_period as enum ('daily', 'weekly', 'monthly', 'yearly');

-- =========================
-- ACTIVITIES TABLE
-- =========================
create table public.activities (
  id varchar(26) primary key not null,
  constraint activities_valid_ulid
    check (id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'),

  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  type public.activity_type not null default 'manual',
  color text not null default '#7c6af7',
  icon text not null default '●',
  productivity public.productivity_type not null,

  is_active boolean default true,
  created_at timestamptz default now()
);

create unique index unique_activity_name
on public.activities(user_id, name);

create index idx_activities_user
on public.activities(user_id);

-- =========================
-- TIME ENTRIES TABLE
-- =========================
create table public.time_entries (
  id varchar(26) primary key not null,
  constraint time_entries_valid_ulid
    check (id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'),

  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id varchar(26) not null references public.activities(id) on delete cascade,

  start_time timestamptz not null,
  end_time timestamptz,

  duration_seconds int generated always as (
    case 
      when end_time is not null 
      then extract(epoch from (end_time - start_time))::int
      else null
    end
  ) stored,

  source public.activity_type not null,

  created_at timestamptz default now(),

  constraint valid_time
    check (end_time is null or end_time > start_time)
);

create index idx_time_entries_user
on public.time_entries(user_id);

create index idx_time_entries_user_time
on public.time_entries(user_id, start_time desc);

create index idx_time_entries_activity
on public.time_entries(activity_id);

create index idx_time_entries_user_activity
on public.time_entries(user_id, activity_id);

create unique index one_active_timer
on public.time_entries(user_id)
where end_time is null;

-- =========================
-- DEFAULT SCHEDULES
-- =========================
create table public.default_schedules (
  id varchar(26) primary key not null,
  constraint schedules_valid_ulid
    check (id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'),

  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id varchar(26) not null references public.activities(id) on delete cascade,

  start_time time not null,
  end_time time not null,

  days_of_week int[] not null,

  created_at timestamptz default now(),

  constraint valid_schedule
    check (end_time > start_time)
);

create index idx_default_schedules_user
on public.default_schedules(user_id);

-- =========================
-- DAILY SUMMARY
-- =========================
create table public.daily_activity_summary (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  activity_id varchar(26) not null references public.activities(id) on delete cascade,
  total_duration_seconds int not null,

  primary key (user_id, date, activity_id)
);

-- =========================
-- ACTIVITY TARGETS
-- =========================
create table public.activity_targets (
  id varchar(26) primary key not null,
  constraint targets_valid_ulid
    check (id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'),

  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id varchar(26) not null references public.activities(id) on delete cascade,

  period public.target_period not null,
  target_seconds int not null,

  created_at timestamptz default now()
);

create index idx_targets_user
on public.activity_targets(user_id);

create unique index unique_activity_target
on public.activity_targets(user_id, activity_id, period);

-- =========================
-- RLS
-- =========================
alter table public.activities enable row level security;
alter table public.time_entries enable row level security;
alter table public.default_schedules enable row level security;
alter table public.daily_activity_summary enable row level security;
alter table public.activity_targets enable row level security;

-- activities
create policy "own activities"
on public.activities for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- time entries
create policy "own time entries"
on public.time_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- schedules
create policy "own schedules"
on public.default_schedules for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- summary (read only)
create policy "own summary"
on public.daily_activity_summary for select
using (auth.uid() = user_id);

-- targets
create policy "own targets"
on public.activity_targets for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);