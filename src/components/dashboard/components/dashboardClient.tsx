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
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
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
