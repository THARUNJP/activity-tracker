import { ActivityTarget } from "@/types";

// ---- HELPERS ----
export const getActivity = (id: string, activities: ActivityTarget[]) =>
  activities.find((a) => a.id === id);

export const formatHours = (seconds: number) => `${Math.round(seconds / 3600)}h`;

export const formatDuration = (seconds: number) => {
  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};
