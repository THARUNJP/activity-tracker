"use client";

import { useState } from "react";
import { ActivityProps } from "@/types";
import { createClient } from "@/supabase/client";
import { COLORS, ICONS } from "@/lib/constant";
import { ActivityRow } from "./activityRow";

export default function ActivitiesClient({
  userId,
  initialActivities,
}: ActivityProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [isProductive, setIsProductive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function addActivity(e: React.SubmitEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    const { data, error: err } = await supabase
      .from("activities")
      .insert({
        user_id: userId,
        name: name.trim(),
        color,
        icon,
        is_default: false,
        is_productive: isProductive,
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setActivities((prev) => [...prev, data]);
      setName("");
      setShowForm(false);
    }
    setSaving(false);
  }

  async function deleteActivity(id: string) {
    await supabase
      .from("activities")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  const defaults = activities.filter((a) => a.is_default);
  const custom = activities.filter((a) => !a.is_default);

  return (
    <div className="animate-fade-in max-w-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.75rem] font-extrabold tracking-tight mb-1">
            Activities
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your activity categories
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-5 py-2.5"
        >
          {showForm ? "✕ Cancel" : "+ Add Activity"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h3 className="font-bold mb-5">New Activity</h3>

          <form onSubmit={addActivity}>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[0.78rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Reading"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.78rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Type
                </label>
                <select
                  value={isProductive ? "productive" : "leisure"}
                  onChange={(e) =>
                    setIsProductive(e.target.value === "productive")
                  }
                  className="input-field"
                >
                  <option value="productive">Productive</option>
                  <option value="leisure">Leisure</option>
                </select>
              </div>
            </div>

            {/* Icon */}
            <div className="mb-4">
              <label className="block text-[0.78rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Icon
              </label>

              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`w-9 h-9 rounded-md text-lg flex items-center justify-center border-2 transition
                    ${
                      icon === i
                        ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                        : "border-[var(--border)] bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-5">
              <label className="block text-[0.78rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Color
              </label>

              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-md border-3 ${
                      color === c ? "border-white" : "border-transparent"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-[var(--red)] text-sm mb-3">{error}</div>
            )}

            {/* Preview */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs text-[var(--text-muted)]">Preview:</span>

              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  border: `1px solid ${color}`,
                  background: `${color}20`,
                  color: color,
                }}
              >
                {icon} {name || "Activity Name"}
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary w-full disabled:opacity-70"
              disabled={saving}
            >
              {saving ? "Saving…" : "Create Activity"}
            </button>
          </form>
        </div>
      )}

      {/* Default */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Default Activities
        </h2>

        <div className="flex flex-col gap-2">
          {defaults.map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              canDelete={false}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Custom */}
      {custom.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Custom Activities
          </h2>

          <div className="flex flex-col gap-2">
            {custom.map((a) => (
              <ActivityRow
                key={a.id}
                activity={a}
                canDelete
                onDelete={() => deleteActivity(a.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
