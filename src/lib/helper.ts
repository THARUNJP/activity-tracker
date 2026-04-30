import { ActivityTarget } from "@/types";

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
