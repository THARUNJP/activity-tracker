import {
  Activity,
  ActivityTarget,
  DashboardEntry,
  Target,
  TargetPeriod,
  TodaySummary,
} from "@/types";

// ---- HELPERS ----
export const getActivity = (id: string, activities: ActivityTarget[]) =>
  activities.find((a) => a.id === id);

export const formatHours = (seconds: number) =>
  `${Math.round(seconds / 3600)}h`;

export const formatDuration = (seconds: number) => {
  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

// 0 = Sun, 1 = Mon, ..., 6 = Sat
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS = [1, 2, 3, 4, 5];
export const WEEKEND = [0, 6];

export const formatDays = (days: number[]) => {
  if (!days?.length) return "—";
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return "Every day";
  if (sorted.join(",") === WEEKDAYS.join(",")) return "Weekdays";
  if (sorted.join(",") === WEEKEND.join(",")) return "Weekends";
  return sorted.map((d) => DAY_LABELS[d]).join(", ");
};

// "HH:MM:SS" or "HH:MM" -> "HH:MM"
export const formatTime = (t: string) => (t ? t.slice(0, 5) : "");

export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---- DASHBOARD AGGREGATION ----

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Monday as week start
export function startOfWeek(): Date {
  const d = startOfToday();
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function startOfMonth(): Date {
  const d = startOfToday();
  d.setDate(1);
  return d;
}

export function startOfYear(): Date {
  const d = startOfToday();
  d.setMonth(0, 1);
  return d;
}

const PERIOD_START: Record<TargetPeriod, () => Date> = {
  daily: startOfToday,
  weekly: startOfWeek,
  monthly: startOfMonth,
  yearly: startOfYear,
};

export function summarizeToday(
  entries: DashboardEntry[],
  activities: Activity[],
): TodaySummary {
  const todayStart = startOfToday().getTime();
  const today = entries.filter(
    (e) => new Date(e.start_time).getTime() >= todayStart,
  );

  const productivityById = new Map(
    activities.map((a) => [a.id, a.productivity]),
  );

  const breakdownMap = new Map<string, number>();
  let total = 0;
  let productive = 0;
  let leisure = 0;

  for (const e of today) {
    const secs = e.duration_seconds ?? 0;
    total += secs;
    breakdownMap.set(
      e.activity_id,
      (breakdownMap.get(e.activity_id) ?? 0) + secs,
    );
    if (productivityById.get(e.activity_id) === "productive") productive += secs;
    else leisure += secs;
  }

  return {
    totalSeconds: total,
    productiveSeconds: productive,
    leisureSeconds: leisure,
    sessions: today.length,
    breakdown: [...breakdownMap.entries()]
      .map(([activityId, seconds]) => ({ activityId, seconds }))
      .sort((a, b) => b.seconds - a.seconds),
  };
}

export function targetProgress(
  target: Target,
  entries: DashboardEntry[],
): number {
  const periodStart = PERIOD_START[target.period]().getTime();
  return entries
    .filter(
      (e) =>
        e.activity_id === target.activity_id &&
        new Date(e.start_time).getTime() >= periodStart,
    )
    .reduce((sum, e) => sum + (e.duration_seconds ?? 0), 0);
}
