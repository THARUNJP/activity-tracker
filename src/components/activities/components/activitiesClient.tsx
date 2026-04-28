"use client";

import { useState } from "react";
import { ActivityProps, ProductivityType } from "@/types";
import { createClient } from "@/supabase/client";
import { COLORS, ICONS } from "@/lib/constant";
import { ActivityRow } from "./activityRow";
import { ulid } from "ulid";

export default function ActivitiesClient({
  userId,
  initialActivities,
}: ActivityProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [Productive, setIsProductive] =
    useState<ProductivityType>("productive");
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
        id: ulid(),
        user_id: userId,
        name: name.trim(),
        color,
        icon,
        productivity: Productive,
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

  return (
    <div className="animate-fade-in max-w-[820px] w-full mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Activities</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your activity categories
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="
          inline-flex items-center justify-center gap-2
          px-5 py-2.5
          text-sm font-semibold
          rounded-lg
          bg-[var(--accent)] text-white
          hover:opacity-90
          active:scale-[0.98]
          transition-all duration-150
        "
        >
          <span
            className={`inline-block transition-transform duration-200 ${
              showForm ? "rotate-45" : "rotate-0"
            }`}
          >
            +
          </span>
          {showForm ? "Cancel" : "Add Activity"}
        </button>
      </div>

      {/* Form — slide open */}
      <div
        className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${showForm ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}
      `}
      >
        <div className="glass-card p-6">
          <h3 className="font-semibold text-lg mb-6">New Activity</h3>

          <form onSubmit={addActivity}>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="label">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Reading"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Type</label>
                <select
                  value={Productive}
                  onChange={(e) =>
                    setIsProductive(e.target.value as ProductivityType)
                  }
                  className="input-field"
                >
                  <option value="productive">Productive</option>
                  <option value="leisure">Leisure</option>
                </select>
              </div>
            </div>

            {/* Icon */}
            <div className="mb-5">
              <label className="label">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`
                    w-9 h-9 rounded-md text-lg flex items-center justify-center
                    border transition-all duration-150
                    ${
                      icon === i
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] scale-110 shadow-sm"
                        : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:scale-105"
                    }
                  `}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <label className="label">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`
                    w-7 h-7 rounded-md border-2 transition-all duration-150
                    ${color === c ? "border-white scale-110 shadow-md" : "border-transparent hover:scale-105"}
                  `}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && <div className="alert-error mb-4">{error}</div>}

            {/* Preview */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
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
              className="btn-primary w-full"
              disabled={saving}
            >
              {saving ? "Saving..." : "Create Activity"}
            </button>
          </form>
        </div>
      </div>
      {/* Custom Activities */}
      {activities.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Activities
          </h2>
          <div className="flex flex-col gap-2">
            {activities.map((a) => (
              <ActivityRow
                key={a.id}
                activity={a}
                canDelete
                onDelete={() => deleteActivity(a.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
