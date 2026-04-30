"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ulid } from "ulid";
import { createClient } from "@/supabase/client";
import { ScheduleProps } from "@/types";
import { getActivity } from "@/lib/helper";
import { ScheduleRow } from "./scheduleRow";
import { ScheduleForm, ScheduleFormState } from "./scheduleForm";
import { SchedulesHeader } from "./schedulesHeader";

const initialFormState = (firstActivityId: string): ScheduleFormState => ({
  activityId: firstActivityId,
  days: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "10:00",
});

export default function SchedulesClient({
  userId,
  activities,
  initialSchedules,
}: ScheduleProps) {
  const supabase = createClient();

  const [schedules, setSchedules] = useState(initialSchedules ?? []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScheduleFormState>(
    initialFormState(activities[0]?.id || "")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function addSchedule(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.activityId) return setError("Please pick an activity");
    if (!form.days.length) return setError("Pick at least one day");
    if (form.endTime <= form.startTime)
      return setError("End time must be after start time");

    setSaving(true);
    setError("");

    const { data, error: err } = await supabase
      .from("default_schedules")
      .insert({
        id: ulid(),
        user_id: userId,
        activity_id: form.activityId,
        start_time: form.startTime,
        end_time: form.endTime,
        days_of_week: [...form.days].sort((a, b) => a - b),
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setSchedules((prev) =>
        [...prev, data].sort((a, b) =>
          a.start_time.localeCompare(b.start_time)
        )
      );
      setForm(initialFormState(activities[0]?.id || ""));
      setShowForm(false);
    }

    setSaving(false);
  }

  async function deleteSchedule(id: string) {
    const { error } = await supabase
      .from("default_schedules")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error(error.message);
      return;
    }

    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  const noActivities = activities.length === 0;

  return (
    <div className="animate-fade-in max-w-[820px] w-full mx-auto px-4 py-4">
      <SchedulesHeader
        showForm={showForm}
        disabled={noActivities}
        onToggle={() => setShowForm(!showForm)}
      />

      {noActivities && (
        <div className="glass-card p-5 mb-6 text-sm text-[var(--text-secondary)]">
          Create an activity first to schedule it.
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showForm ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <ScheduleForm
          activities={activities}
          state={form}
          setState={setForm}
          onSubmit={addSchedule}
          saving={saving}
          error={error}
        />
      </div>

      {schedules.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Schedules
          </h2>
          <div className="flex flex-col gap-2">
            {schedules.map((s) => {
              const activity = getActivity(s.activity_id, activities);
              if (!activity) return null;
              return (
                <ScheduleRow
                  key={s.id}
                  schedule={s}
                  activity={activity}
                  onDelete={() => deleteSchedule(s.id)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
