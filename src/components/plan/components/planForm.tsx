"use client";

import type { FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { ActivityTarget } from "@/types";

export interface PlanFormState {
  activityId: string;
  startTime: string;
  endTime: string;
}

// "HH:MM" -> "9:00 AM"
function to12h(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr ?? "0", 10);
  if (Number.isNaN(h)) return "";
  const suffix = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function PlanForm({
  activities,
  state,
  setState,
  onSubmit,
  onDelete,
  onCancel,
  saving,
  error,
  editing,
}: {
  activities: ActivityTarget[];
  state: PlanFormState;
  setState: (s: PlanFormState) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
  editing: boolean;
}) {
  const activeColor =
    activities.find((a) => a.id === state.activityId)?.color ?? "var(--accent)";

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">
          {editing ? "Edit Block" : "New Block"}
        </h3>
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: activeColor }}
        />
      </div>

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
        <div className="grid grid-cols-2 gap-3 mb-6">
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
            <div className="mt-1.5 text-[12px] font-semibold text-[var(--accent)]">
              {to12h(state.startTime)}
            </div>
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
            <div className="mt-1.5 text-[12px] font-semibold text-[var(--accent)]">
              {to12h(state.endTime)}
            </div>
          </div>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          {editing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--red)] text-[var(--red)] hover:bg-[var(--red-dim)] transition disabled:opacity-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Block"
                : "Create Block"}
          </button>
        </div>
      </form>
    </div>
  );
}
