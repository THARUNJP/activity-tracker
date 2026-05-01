"use client";

import { Activity } from "@/types";
import TimerWidget from "./timerWidget";
import { useState } from "react";
import { createClient } from "@/supabase/client";
import { useTimer } from "@/hooks/useTimer";
import { dashboardData } from "@/lib/constant";
import TodayStats from "./todayStats";
import BreakdownSection from "./breakdownStats";
import { PeriodSection } from "./periodSection";
import { ChartSection } from "./chartSection";
import { DayDetailSection } from "./dayDetail";
import { ProductivitySection } from "./productivitySection";
import { TargetsSection } from "./targetSection";

interface Props {
  userId: string;
  initialActivities: Activity[];
}

export default function DashboardClient({ userId, initialActivities }: Props) {
  const [activities, setActivities] = useState(initialActivities);
  const [refreshKey, setRefreshKey] = useState(0);
  const supabase = createClient();
  const timer = useTimer(userId);

  function handleEntrySaved() {
    setRefreshKey((k) => k + 1);
  }
  return (
    <div className="animate-fade-in max-w-[900px] mx-auto w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Timer */}
      <TimerWidget
        userId={userId}
        activities={activities}
        timer={timer}
        onSaved={handleEntrySaved}
      />

      {/* Today Stats */}
      <TodayStats data={dashboardData.today} />

      {/* Breakdown */}
      <BreakdownSection
        breakdown={dashboardData.today.breakdown}
        total={dashboardData.today.totalSeconds}
        activities={activities}
      />

      <PeriodSection />

      <ChartSection />
      <DayDetailSection />

      <ProductivitySection />
      {/* Targets */}
      <TargetsSection targets={dashboardData.targets} />
    </div>
  );
}
