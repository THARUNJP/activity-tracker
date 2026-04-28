import { ActivityTarget } from "@/types";

// ---- HELPERS ----
export const getActivity = (id: string, activities: ActivityTarget[]) =>
  activities.find((a) => a.id === id);

export const formatHours = (seconds: number) => `${Math.round(seconds / 3600)}h`;
