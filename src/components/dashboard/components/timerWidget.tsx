"use client";

import { useState } from "react";
import type { Activity } from "@/types";
import { useTimer } from "@/hooks/useTimer";
import { showHotToast } from "@/lib/toast";
import { TimerChips } from "./timerChips";
import { TimerDisplay } from "./timerDisplay";

type TimerHook = ReturnType<typeof useTimer>;

interface Props {
  activities: Activity[];
  timer: TimerHook;
  onSaved: () => void;
}

export default function TimerWidget({ activities, timer, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const { timerState, displaySeconds, start, pause, stop, reset, setActivity } =
    timer;

  const selectedActivity = activities.find(
    (a) => a.id === timerState.activityId,
  );
  const isRunning = timerState.isRunning;
  const hasTime = displaySeconds > 0;
  const canStart = !!timerState.activityId;

  async function handleStop() {
    setSaving(true);
    const result = await stop();
    setSaving(false);

    if (result.skippedShort) {
      showHotToast("Session too short — discarded", "custom");
      return;
    }
    if (result.error) {
      showHotToast(result.error, "error");
      return;
    }
    if (result.id) {
      showHotToast("Session saved", "success");
      onSaved();
    }
  }

  function handleStartPause() {
    if (!timerState.activityId) {
      showHotToast("Pick an activity first", "error");
      return;
    }
    if (isRunning) pause();
    else start(timerState.activityId);
  }

  return (
    <div className="glass-card relative overflow-hidden p-6">
      {isRunning && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,106,247,0.08)_0%,transparent_70%)]" />
      )}

      <TimerDisplay
        seconds={displaySeconds}
        state={isRunning ? "running" : hasTime ? "paused" : "ready"}
        activity={selectedActivity}
      />

      {/* Activity chips — horizontal scroll */}
      <div className="relative mt-5">
        <TimerChips
          activities={activities}
          selectedId={timerState.activityId}
          onSelect={(id) => {
            setActivity(id);
            if (!isRunning) start(id);
          }}
        />
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {hasTime && !isRunning && (
          <button
            onClick={reset}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition"
          >
            Reset
          </button>
        )}

        {hasTime && (
          <button
            onClick={handleStop}
            disabled={saving || isRunning}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2 text-sm font-bold text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}

        <button
          onClick={handleStartPause}
          disabled={!canStart}
          className={`min-w-[110px] rounded-xl px-7 py-3 text-sm font-bold transition ${
            isRunning
              ? "bg-[var(--yellow,#fbbf24)] text-black"
              : canStart
                ? "bg-[var(--accent)] text-white hover:opacity-90"
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
          }`}
        >
          {isRunning ? "⏸ Pause" : hasTime ? "▶ Resume" : "▶ Start"}
        </button>
      </div>
    </div>
  );
}
