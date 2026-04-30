export type ProductivityType = "productive" | "leisure";

export interface Activity {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  productivity: ProductivityType;
  created_at: string;
}

export type ActivityTarget = Pick<Activity, "id" | "name" | "color" | "icon">;

export interface TimeEntry {
  id: string;
  user_id: string;
  activity_id: string;
  start_time: string;
  end_time: string | null;
  duration: number | null; // seconds
  notes: string | null;
  is_auto_waste: boolean;
  created_at: string;
  activity?: Activity;
}

export interface Settings {
  id: string;
  user_id: string;
  idle_threshold_minutes: number;
  expected_sleep_hours: number;
  expected_work_hours: number;
  created_at: string;
  updated_at: string;
}

export interface TimerState {
  isRunning: boolean;
  startTime: number | null; // unix ms
  elapsed: number; // seconds accumulated before last resume
  activityId: string | null;
}

export interface DashboardStats {
  totalTracked: number; // seconds
  productiveTime: number;
  wasteTime: number;
  productivityScore: number;
  byActivity: { activity: Activity; duration: number }[];
  entries: TimeEntry[];
}

export type ViewPeriod = "day" | "week" | "month";

export const DEFAULT_ACTIVITY_COLORS: Record<string, string> = {
  Work: "#7c6af7",
  Study: "#22d3ee",
  Sleep: "#4ade80",
  Exercise: "#fb923c",
  Entertainment: "#f472b6",
  Waste: "#f87171",
};

export const DEFAULT_ACTIVITY_ICONS: Record<string, string> = {
  Work: "💼",
  Study: "📚",
  Sleep: "😴",
  Exercise: "🏃",
  Entertainment: "🎮",
  Waste: "⏳",
};

export interface ActivityProps {
  userId: string;
  initialActivities: Activity[];
}

export type TargetPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface Target {
  id: string;
  activity_id: string;
  period: TargetPeriod;
  target_seconds: number;
}

export interface TargetProps {
  userId: string;
  activities: ActivityTarget[];
  initialTargets: Target[];
}

export interface Schedule {
  id: string;
  user_id: string;
  activity_id: string;
  start_time: string; // "HH:MM:SS" or "HH:MM"
  end_time: string;
  days_of_week: number[]; // 0=Sun .. 6=Sat
  created_at: string;
}

export interface ScheduleProps {
  userId: string;
  activities: ActivityTarget[];
  initialSchedules: Schedule[];
}
