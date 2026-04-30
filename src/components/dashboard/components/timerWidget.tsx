"use client";

import { useState } from "react";
import type { Activity } from "@/types";
import { useTimer } from "@/hooks/useTimer";
import { formatTimer } from "@/lib/helper";

type TimerHook = ReturnType<typeof useTimer>;

interface Props {
  userId: string;
  activities: Activity[];
  timer: TimerHook;
  onSaved: () => void;
}

export default function TimerWidget({ activities, timer, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const { timerState, displaySeconds, start, pause, stop, reset, setActivity } =
    timer;

  const selectedActivity = activities.find(
    (a) => a.id === timerState.activityId,
  );
  const isRunning = timerState.isRunning;

  async function handleStop() {
    setSaving(true);
    const id = await stop();
    setSaving(false);
    if (id) {
      setSavedMsg("Saved!");
      onSaved();
      setTimeout(() => setSavedMsg(""), 2000);
    }
  }

  function handleStartPause() {
    if (!timerState.activityId) return;
    if (isRunning) {
      pause();
    } else {
      start(timerState.activityId);
    }
  }

  const canStart = !!timerState.activityId;
  const hasTime = displaySeconds > 0;

  return (
    <div className="glass-card relative overflow-hidden p-6">
      {/* Background glow when running */}
      {isRunning && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,106,247,0.06)_0%,transparent_70%)]" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Timer display */}
        <div>
          {/* Status */}
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {isRunning ? (
              <>
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--green)]" />
                Recording
              </>
            ) : hasTime ? (
              "Paused"
            ) : (
              "Timer"
            )}
          </div>

          {/* 🔥 Bigger timer ONLY */}
          <div
            className={`font-mono font-bold tracking-tight leading-none transition-colors duration-300
            text-5xl sm:text-6xl md:text-7xl
            ${
              isRunning
                ? "text-[var(--text-primary)]"
                : hasTime
                  ? "text-[var(--yellow)]"
                  : "text-[var(--text-muted)]"
            }
          `}
            style={{ fontFamily: "Space Mono, monospace" }}
          >
            {formatTimer(displaySeconds)}
          </div>

          {/* Activity */}
          {selectedActivity && (
            <div className="mt-2 flex items-center gap-2">
              <span>{selectedActivity.icon}</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {selectedActivity.name}
              </span>
            </div>
          )}
        </div>

        {/* Controls (UNCHANGED mostly) */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex max-w-[400px] flex-wrap justify-end gap-2">
            {activities.map((activity) => {
              const isActive = timerState.activityId === activity.id;

              return (
                <button
                  key={activity.id}
                  onClick={() => {
                    setActivity(activity.id);
                    if (!isRunning) start(activity.id);
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150
                ${
                  isActive
                    ? "text-[color:var(--activity-color)] bg-[color:var(--activity-bg)] border-[color:var(--activity-color)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] bg-transparent"
                }`}
                  style={
                    isActive
                      ? ({
                          "--activity-color": activity.color,
                          "--activity-bg": `${activity.color}20`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span>{activity.icon}</span>
                  {activity.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            {savedMsg && (
              <span className="text-sm font-semibold text-[var(--green)]">
                {savedMsg}
              </span>
            )}

            {hasTime && !isRunning && (
              <button
                onClick={reset}
                className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-muted)]"
              >
                Reset
              </button>
            )}

            {hasTime && (
              <button
                onClick={handleStop}
                disabled={saving || isRunning}
                className={`rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-bold
              ${
                isRunning
                  ? "text-[var(--text-muted)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-primary)] bg-[var(--bg-elevated)]"
              }
              ${saving ? "opacity-60" : ""}
            `}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            )}

            <button
              onClick={handleStartPause}
              disabled={!canStart}
              className={`min-w-[100px] rounded-xl px-7 py-3 text-sm font-bold
            ${
              isRunning
                ? "bg-[var(--yellow)] text-black"
                : canStart
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }
          `}
            >
              {isRunning ? "⏸ Pause" : hasTime ? "▶ Resume" : "▶ Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
