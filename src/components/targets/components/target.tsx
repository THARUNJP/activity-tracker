"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/supabase/client";
import { ulid } from "ulid";
import { TargetPeriod, TargetProps } from "@/types";
import { formatHours, getActivity } from "@/lib/helper";

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
  const [hours, setHours] = useState(1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---- CREATE TARGET ----
  async function addTarget(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activityId || hours <= 0) return;

    setSaving(true);
    setError("");

    const { data, error: err } = await supabase
      .from("activity_targets")
      .insert({
        id: ulid(),
        user_id: userId,
        activity_id: activityId,
        period,
        target_seconds: hours * 3600,
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
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white"
        >
          + {showForm ? "Cancel" : "Add Target"}
        </button>
      </div>

      {/* Form */}
      <div
        className={`transition-all duration-300 ${
          showForm ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="glass-card p-6">
          <form onSubmit={addTarget}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Activity */}
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="input-field"
              >
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* Period */}
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

              {/* Hours */}
              <input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="input-field"
                placeholder="Hours"
              />
            </div>

            {error && <div className="alert-error mb-3">{error}</div>}

            <button className="btn-primary w-full" disabled={saving}>
              {saving ? "Saving..." : "Create Target"}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      {targets.length > 0 && (
        <div className="flex flex-col gap-2">
          {targets.map((t) => {
            const activity = getActivity(t.activity_id, activities);
            if (!activity) return null;

            return (
              <div
                key={t.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{
                    border: `1px solid ${activity.color}`,
                    background: `${activity.color}20`,
                    color: activity.color,
                  }}
                >
                  {activity.icon} {activity.name}
                </div>

                <div className="text-sm">
                  {t.period} • {formatHours(t.target_seconds)}
                </div>

                <button
                  onClick={() => deleteTarget(t.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
