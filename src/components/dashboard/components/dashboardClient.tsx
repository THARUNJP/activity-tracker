"use client";

import { Activity } from "@/types";
import TimerWidget from "./timerWidget";
import { useState } from "react";
import { createClient } from "@/supabase/client";
import { useTimer } from "@/hooks/useTimer";

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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-1.5 text-[1.75rem] font-extrabold tracking-[-0.02em]">
          Dashboard
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
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
    </div>
  );
}
