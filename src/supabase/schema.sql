-- ============================================================
-- Activity Tracker - Final Supabase Schema
-- ============================================================

-- =========================
-- ENUMS
-- =========================

CREATE TYPE activity_type AS ENUM ('manual', 'system');
CREATE TYPE productivity_type  AS ENUM ('productive', 'leisure');

CREATE TYPE target_period AS ENUM ('daily', 'weekly', 'monthly', 'yearly');


-- =========================
-- ACTIVITIES TABLE
-- =========================

-- activities table
CREATE TABLE activities (
  id CHAR(26) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type activity_type NOT NULL,
  productivity productivity_type NOT NULL
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- unique activity name per user
CREATE UNIQUE INDEX unique_activity_name
ON activities(user_id, name);

CREATE INDEX idx_activities_user
ON activities(user_id);


-- =========================
-- TIME ENTRIES TABLE
-- =========================

-- core time tracking table
CREATE TABLE time_entries (
  id CHAR(26) PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id CHAR(26) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_seconds INT,

  source activity_type NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT valid_time
    CHECK (end_time IS NULL OR end_time > start_time),

  CONSTRAINT duration_positive
    CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

CREATE INDEX idx_time_entries_user
ON time_entries(user_id);

CREATE INDEX idx_time_entries_user_time
ON time_entries(user_id, start_time DESC);

CREATE INDEX idx_time_entries_activity
ON time_entries(activity_id);

CREATE INDEX idx_time_entries_user_activity
ON time_entries(user_id, activity_id);

-- only one active timer per user
CREATE UNIQUE INDEX one_active_timer
ON time_entries(user_id)
WHERE end_time IS NULL;


-- =========================
-- DEFAULT SCHEDULES TABLE
-- =========================

-- used for system-generated entries (sleep etc.)
CREATE TABLE default_schedules (
  id CHAR(26) PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id CHAR(26) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,

  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  days_of_week INT[] NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_default_schedules_user
ON default_schedules(user_id);


-- =========================
-- DAILY SUMMARY TABLE
-- =========================

-- precomputed daily totals
CREATE TABLE daily_activity_summary (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_id CHAR(26) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  total_duration_seconds INT NOT NULL,

  PRIMARY KEY (user_id, date, activity_id)
);


-- =========================
-- ACTIVITY TARGETS TABLE
-- =========================

-- user-defined targets
CREATE TABLE activity_targets (
  id CHAR(26) PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id CHAR(26) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,

  period target_period NOT NULL,
  target_seconds INT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_targets_user
ON activity_targets(user_id);

-- prevent duplicate targets
CREATE UNIQUE INDEX unique_activity_target
ON activity_targets(user_id, activity_id, period);


-- =========================
-- RLS (ROW LEVEL SECURITY)
-- =========================

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE default_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_targets ENABLE ROW LEVEL SECURITY;

-- activities
CREATE POLICY "own activities"
ON activities FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- time entries
CREATE POLICY "own time entries"
ON time_entries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- schedules
CREATE POLICY "own schedules"
ON default_schedules FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- summary (read only)
CREATE POLICY "own summary"
ON daily_activity_summary FOR SELECT
USING (auth.uid() = user_id);

-- targets
CREATE POLICY "own targets"
ON activity_targets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);