"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/supabase/client";
import { ulid } from "ulid";
import { TargetPeriod, TargetProps } from "@/types";
import { formatDuration, getActivity } from "@/lib/helper";
import { TargetRow } from "./targetRow";

export default function TargetsClient({
  userId,
  activities,
  initialTargets,
}: TargetProps) {
  const supabase = createClient();

  const [targets, setTargets] = useState(initialTargets ?? []);
  const [showForm, setShowForm] = useState(false);

  const [activityId, setActivityId] = useState<string>(activities[0]?.id || "");
  const [period, setPeriod] = useState<TargetPeriod>("daily");
  const [hours, setHours] = useState<number | "">(1);
  const [minutes, setMinutes] = useState<number | "">(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalSeconds =
    (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;

  // ---- CREATE TARGET ----
  async function addTarget(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activityId) {
      setError("Please pick an activity");
      return;
    }
    if (totalSeconds <= 0) {
      setError("Set at least 1 minute");
      return;
    }

    setSaving(true);
    setError("");

    const { data, error: err } = await supabase
      .from("activity_targets")
      .insert({
        id: ulid(),
        user_id: userId,
        activity_id: activityId,
        period,
        target_seconds: totalSeconds,
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setTargets((prev) => [...prev, data]);

      // reset
      setActivityId(activities[0]?.id || "");
      setPeriod("daily");
      setHours(1);
      setMinutes(0);
      setShowForm(false);
    }

    setSaving(false);
  }

  // ---- DELETE ----
  async function deleteTarget(id: string) {
    const { error } = await supabase
      .from("activity_targets")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error(error.message);
      return;
    }

    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  const noActivities = activities.length === 0;

  return (
    <div className="animate-fade-in max-w-[820px] w-full mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Targets</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Set goals for your activities
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          disabled={noActivities}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            className={`inline-block transition-transform duration-200 ${
              showForm ? "rotate-45" : "rotate-0"
            }`}
          >
            +
          </span>
          {showForm ? "Cancel" : "Add Target"}
        </button>
      </div>

      {noActivities && (
        <div className="glass-card p-5 mb-6 text-sm text-[var(--text-secondary)]">
          Create an activity first to set a target for it.
        </div>
      )}

      {/* Form */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showForm ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <div className="glass-card p-6">
          <h3 className="font-semibold text-lg mb-6">New Target</h3>

          <form onSubmit={addTarget}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Activity */}
              <div>
                <label className="label">Activity</label>
                <select
                  value={activityId}
                  onChange={(e) => setActivityId(e.target.value)}
                  className="input-field"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.icon} {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="label">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as TargetPeriod)}
                  className="input-field"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-5">
              <label className="label">Duration</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={hours}
                    onChange={(e) => {
                      const v = e.target.value;
                      setHours(v === "" ? "" : Math.max(0, Number(v)));
                    }}
                    placeholder="0"
                    className="input-field pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] pointer-events-none">
                    hr
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMinutes(
                        v === "" ? "" : Math.min(59, Math.max(0, Number(v)))
                      );
                    }}
                    placeholder="0"
                    className="input-field pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] pointer-events-none">
                    min
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                e.g. 1 hr 30 min — leave either blank for just hours or just
                minutes.
              </p>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)]">Preview:</span>
              <span className="text-sm font-semibold">
                {totalSeconds > 0
                  ? `${formatDuration(totalSeconds)} • ${period}`
                  : "Set a duration"}
              </span>
            </div>

            {error && <div className="alert-error mb-4">{error}</div>}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={saving}
            >
              {saving ? "Saving..." : "Create Target"}
            </button>
          </form>
        </div>
      </div>

      {/* Targets */}
      {targets.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Targets
          </h2>

          <div className="flex flex-col gap-2">
            {targets.map((t) => {
              const activity = getActivity(t.activity_id, activities);
              if (!activity) return null;
              return (
                <TargetRow
                  key={t.id}
                  target={t}
                  activity={activity}
                  onDelete={() => deleteTarget(t.id)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
