"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardClientProps, DashboardEntry } from "@/types";
import { useTimer } from "@/hooks/useTimer";
import { createClient } from "@/supabase/client";
import { startOfYear, summarizeToday, targetProgress } from "@/lib/helper";
import { showHotToast } from "@/lib/toast";
import TimerWidget from "./timerWidget";
import TodayStats from "./todayStats";
import BreakdownSection from "./breakdownStats";
import { TargetsSection } from "./targetSection";
import RecentSessions from "./recentSessions";

export default function DashboardClient({
  userId,
  activities,
  entriesYear,
  targets,
}: DashboardClientProps) {
  const supabase = createClient();
  const timer = useTimer(userId);

  const [entries, setEntries] = useState<DashboardEntry[]>(entriesYear);

  async function refresh() {
    const yearStart = startOfYear().toISOString();
    const { data, error } = await supabase
      .from("time_entries")
      .select("id, activity_id, start_time, end_time, duration_seconds")
      .eq("user_id", userId)
      .not("end_time", "is", null)
      .gte("start_time", yearStart)
      .order("start_time", { ascending: false });

    if (error) {
      showHotToast("Couldn't refresh dashboard", "error");
      return;
    }
    setEntries(data ?? []);
  }

  useEffect(() => {
    setEntries(entriesYear);
  }, [entriesYear]);

  const summary = useMemo(
    () => summarizeToday(entries, activities),
    [entries, activities],
  );

  const targetsWithProgress = useMemo(
    () =>
      targets.map((t) => ({
        target: t,
        achievedSeconds: targetProgress(t, entries),
      })),
    [targets, entries],
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-fade-in max-w-[900px] mx-auto w-full px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{today}</p>
      </div>

      <TimerWidget
        activities={activities}
        timer={timer}
        onSaved={refresh}
      />

      <TodayStats summary={summary} />

      <BreakdownSection summary={summary} activities={activities} />

      <TargetsSection
        targets={targetsWithProgress}
        activities={activities}
      />

      <RecentSessions entries={entries} activities={activities} />
    </div>
  );
}
