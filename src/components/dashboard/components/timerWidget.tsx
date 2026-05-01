"use client";

import { useState } from "react";
import type { Activity } from "@/types";
import { useTimer } from "@/hooks/useTimer";

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

  function format(seconds: number) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  async function handleStop() {
    setSaving(true);
    const result = await stop();
    setSaving(false);

    if (result?.id) onSaved();
  }

  function handleStartPause() {
    if (!canStart) return;
    isRunning ? pause() : start(timerState.activityId!);
  }

  return (
    <div className="space-y-4">
      {/* LABEL */}
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        Timer
      </p>

      {/* ACTIVITY CHIPS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activities.map((a) => {
          const active = a.id === timerState.activityId;

          return (
            <button
              key={a.id}
              onClick={() => setActivity(a.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition
                ${
                  active
                    ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]"
                    : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)]"
                }
              `}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: a.color }}
              />
              {a.name}
            </button>
          );
        })}
      </div>

      {/* CARD */}
      <div className="glass-card rounded-2xl border border-[var(--border)] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: selectedActivity?.color }}
            />

            <span className="font-medium text-sm sm:text-base">
              {selectedActivity?.name || "Select Activity"}
            </span>
          </div>

          {selectedActivity && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
                ${
                  selectedActivity.productivity === "productive"
                    ? "bg-[var(--green-dim)] text-[var(--green)]"
                    : "bg-[var(--red-dim)] text-[var(--red)]"
                }
              `}
            >
              {selectedActivity.productivity === "productive"
                ? "Productive"
                : "Leisure"}
            </span>
          )}
        </div>

        {/* TIMER */}
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
          <div
            className={`font-mono tabular-nums tracking-tight leading-none
              text-6xl sm:text-7xl md:text-8xl font-light transition-colors
              ${
                isRunning
                  ? "text-[var(--accent)]"
                  : hasTime
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
              }
            `}
            style={{ fontFamily: "Space Mono, monospace" }}
          >
            {format(displaySeconds)}
          </div>

          <div className="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
            {isRunning ? "Recording..." : hasTime ? "Paused" : "Ready to start"}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-center gap-2.5 px-4 pb-4">
          {hasTime && !isRunning && (
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition"
            >
              Reset
            </button>
          )}

          {hasTime && (
            <button
              onClick={handleStop}
              disabled={saving || isRunning}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--bg-elevated)] transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          )}

          <button
            onClick={handleStartPause}
            disabled={!canStart}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition
              ${
                isRunning
                  ? "bg-[var(--red)] text-white"
                  : canStart
                    ? "bg-[var(--accent)] text-white hover:opacity-90"
                    : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
              }
            `}
          >
            {isRunning ? "Stop" : hasTime ? "Resume" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
