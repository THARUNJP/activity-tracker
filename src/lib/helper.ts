import {
  Activity,
  ActivityTarget,
  AnalyticsBucket,
  AnalyticsPeriod,
  DashboardEntry,
  DateRange,
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

// Deterministic locale-independent date formatters.
// toLocaleDateString varies between Node (server) and the browser, which
// triggers hydration mismatches. These build the string by hand instead.
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LONG_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LONG_WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function formatDateShort(d: Date, withYear = false): string {
  const base = `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
  return withYear ? `${base}, ${d.getFullYear()}` : base;
}

export function formatDateLong(d: Date): string {
  return `${LONG_WEEKDAYS[d.getDay()]}, ${LONG_MONTHS[d.getMonth()]} ${d.getDate()}`;
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

// ---- ANALYTICS ----

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function getRangeForPeriod(
  period: AnalyticsPeriod,
  custom?: DateRange,
): DateRange {
  const today = startOfToday();
  switch (period) {
    case "week":
      return { start: startOfWeek(), end: addDays(startOfWeek(), 7) };
    case "month": {
      const start = startOfMonth();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      return { start, end };
    }
    case "year": {
      const start = startOfYear();
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      return { start, end };
    }
    case "custom":
      return (
        custom ?? { start: addDays(today, -6), end: addDays(today, 1) }
      );
  }
}

// Decide bucket granularity based on the range span
function bucketGranularity(range: DateRange): "day" | "month" {
  const days = Math.round(
    (range.end.getTime() - range.start.getTime()) / 86400000,
  );
  return days > 90 ? "month" : "day";
}

function dayLabel(d: Date, totalDays: number): string {
  if (totalDays <= 7) return DAY_LABELS[d.getDay()];
  return String(d.getDate());
}

// Local-date keys keep bucket creation and entry assignment in the same TZ
// (toISOString is UTC, which would shift entries to the wrong bucket for
// users not on UTC).
function dayKeyLocal(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function monthKeyLocal(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function bucketEntries(
  entries: DashboardEntry[],
  range: DateRange,
  activities: Activity[],
): AnalyticsBucket[] {
  const granularity = bucketGranularity(range);
  const buckets: AnalyticsBucket[] = [];
  const index = new Map<string, AnalyticsBucket>();

  if (granularity === "day") {
    const totalDays = Math.max(
      1,
      Math.round((range.end.getTime() - range.start.getTime()) / 86400000),
    );
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(range.start, i);
      const bucket: AnalyticsBucket = {
        label: dayLabel(d, totalDays),
        total: 0,
      };
      activities.forEach((a) => (bucket[a.id] = 0));
      buckets.push(bucket);
      index.set(dayKeyLocal(d), bucket);
    }
  } else {
    const cursor = new Date(range.start);
    cursor.setDate(1);
    while (cursor < range.end) {
      const bucket: AnalyticsBucket = {
        label: MONTH_LABELS[cursor.getMonth()],
        total: 0,
      };
      activities.forEach((a) => (bucket[a.id] = 0));
      buckets.push(bucket);
      index.set(monthKeyLocal(cursor), bucket);
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  for (const e of entries) {
    const d = new Date(e.start_time);
    if (d < range.start || d >= range.end) continue;
    const key = granularity === "day" ? dayKeyLocal(d) : monthKeyLocal(d);
    const bucket = index.get(key);
    if (!bucket) continue;
    const secs = e.duration_seconds ?? 0;
    bucket.total = (bucket.total as number) + secs;
    bucket[e.activity_id] = ((bucket[e.activity_id] as number) ?? 0) + secs;
  }

  return buckets;
}

// One bar per activity (used for single-day custom view).
// Each bucket has exactly one non-zero activity key so the existing stacked
// chart renders each bar in the activity's own color.
export function bucketByActivity(
  entries: DashboardEntry[],
  range: DateRange,
  activities: Activity[],
): AnalyticsBucket[] {
  const totals = new Map<string, number>();
  for (const e of entries) {
    const d = new Date(e.start_time);
    if (d < range.start || d >= range.end) continue;
    totals.set(
      e.activity_id,
      (totals.get(e.activity_id) ?? 0) + (e.duration_seconds ?? 0),
    );
  }

  return activities
    .filter((a) => (totals.get(a.id) ?? 0) > 0)
    .map((a) => {
      const seconds = totals.get(a.id) ?? 0;
      const bucket: AnalyticsBucket = {
        label: `${a.icon} ${a.name}`,
        total: seconds,
      };
      activities.forEach((other) => {
        bucket[other.id] = other.id === a.id ? seconds : 0;
      });
      return bucket;
    })
    .sort((a, b) => Number(b.total) - Number(a.total));
}

export function totalInRange(
  entries: DashboardEntry[],
  range: DateRange,
): number {
  return entries
    .filter((e) => {
      const d = new Date(e.start_time);
      return d >= range.start && d < range.end;
    })
    .reduce((sum, e) => sum + (e.duration_seconds ?? 0), 0);
}

export function toDateInputValue(d: Date): string {
  // Local-date YYYY-MM-DD — toISOString would shift across midnight TZs
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromDateInputValue(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}

// End-of-range stored as exclusive next-day midnight, but users pick the
// inclusive last day in the date input.
export function inclusiveEndDate(end: Date): Date {
  const d = new Date(end);
  d.setDate(d.getDate() - 1);
  return d;
}

export function exclusiveEndDate(inclusive: Date): Date {
  const d = new Date(inclusive);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}
