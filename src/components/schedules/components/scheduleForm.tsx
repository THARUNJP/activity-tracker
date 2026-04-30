"use client";

import type { FormEvent } from "react";
import { ActivityTarget } from "@/types";
import { DAY_LABELS, WEEKDAYS, WEEKEND } from "@/lib/helper";

export interface ScheduleFormState {
  activityId: string;
  days: number[];
  startTime: string;
  endTime: string;
}

export function ScheduleForm({
  activities,
  state,
  setState,
  onSubmit,
  saving,
  error,
}: {
  activities: ActivityTarget[];
  state: ScheduleFormState;
  setState: (s: ScheduleFormState) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  error: string;
}) {
  const toggleDay = (d: number) => {
    const next = state.days.includes(d)
      ? state.days.filter((x) => x !== d)
      : [...state.days, d];
    setState({ ...state, days: next });
  };

  const setPreset = (days: number[]) => setState({ ...state, days });

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-lg mb-6">New Schedule</h3>

      <form onSubmit={onSubmit}>
        {/* Activity */}
        <div className="mb-5">
          <label className="label">Activity</label>
          <select
            value={state.activityId}
            onChange={(e) =>
              setState({ ...state, activityId: e.target.value })
            }
            className="input-field"
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.icon} {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="label">Start</label>
            <input
              type="time"
              value={state.startTime}
              onChange={(e) =>
                setState({ ...state, startTime: e.target.value })
              }
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">End</label>
            <input
              type="time"
              value={state.endTime}
              onChange={(e) => setState({ ...state, endTime: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Days */}
        <div className="mb-6">
          <label className="label">Days</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {DAY_LABELS.map((label, idx) => {
              const active = state.days.includes(idx);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150 ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPreset(WEEKDAYS)}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Weekdays
            </button>
            <span className="text-[var(--text-muted)]">·</span>
            <button
              type="button"
              onClick={() => setPreset(WEEKEND)}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Weekends
            </button>
            <span className="text-[var(--text-muted)]">·</span>
            <button
              type="button"
              onClick={() => setPreset([0, 1, 2, 3, 4, 5, 6])}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Every day
            </button>
          </div>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? "Saving..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}
