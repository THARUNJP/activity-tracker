"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ulid } from "ulid";
import { createClient } from "@/supabase/client";
import { Plan, PlanProps } from "@/types";
import { showHotToast } from "@/lib/toast";
import { PlanHeader } from "./planHeader";
import { PlanForm, PlanFormState } from "./planForm";
import { PlanTimeline } from "./planTimeline";

const emptyForm = (firstActivityId: string): PlanFormState => ({
  activityId: firstActivityId,
  startTime: "09:00",
  endTime: "10:00",
});

export default function PlanClient({
  userId,
  activities,
  initialPlans,
}: PlanProps) {
  const supabase = createClient();

  const [plans, setPlans] = useState<Plan[]>(initialPlans ?? []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(
    emptyForm(activities[0]?.id || "")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startCreate(prefill?: { startTime: string; endTime: string }) {
    setEditingId(null);
    setForm({
      ...emptyForm(activities[0]?.id || ""),
      ...(prefill ?? {}),
    });
    setShowForm(true);
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function startEdit(p: Plan) {
    setEditingId(p.id);
    setForm({
      activityId: p.activity_id,
      startTime: p.start_time.slice(0, 5),
      endTime: p.end_time.slice(0, 5),
    });
    setShowForm(true);
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.activityId) return setError("Please pick an activity");
    if (form.endTime === form.startTime)
      return setError("Start and end time can't be the same");

    setSaving(true);
    setError("");

    if (editingId) {
      const { data, error: err } = await supabase
        .from("plans")
        .update({
          activity_id: form.activityId,
          start_time: form.startTime,
          end_time: form.endTime,
        })
        .eq("id", editingId)
        .eq("user_id", userId)
        .select()
        .single();

      if (err) {
        setError(err.message);
        showHotToast(err.message, "error");
      } else if (data) {
        setPlans((prev) =>
          prev
            .map((p) => (p.id === editingId ? data : p))
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
        );
        showHotToast("Block updated", "success");
        closeForm();
      }
    } else {
      const { data, error: err } = await supabase
        .from("plans")
        .insert({
          id: ulid(),
          user_id: userId,
          activity_id: form.activityId,
          start_time: form.startTime,
          end_time: form.endTime,
        })
        .select()
        .single();

      if (err) {
        setError(err.message);
        showHotToast(err.message, "error");
      } else if (data) {
        setPlans((prev) =>
          [...prev, data].sort((a, b) =>
            a.start_time.localeCompare(b.start_time)
          )
        );
        showHotToast("Block created", "success");
        closeForm();
      }
    }

    setSaving(false);
  }

  async function onDelete() {
    if (!editingId) return;
    const idToDelete = editingId;
    const previous = plans;

    setPlans((prev) => prev.filter((p) => p.id !== idToDelete));
    closeForm();

    const { error: err } = await supabase
      .from("plans")
      .delete()
      .eq("id", idToDelete)
      .eq("user_id", userId);

    if (err) {
      setPlans(previous);
      showHotToast(err.message, "error");
      return;
    }

    showHotToast("Block deleted", "success");
  }

  const noActivities = activities.length === 0;

  return (
    <div className="animate-fade-in max-w-[820px] w-full mx-auto px-4 py-4 flex flex-col h-[calc(100dvh-3.5rem)] lg:h-dvh">
      <PlanHeader
        showForm={showForm}
        editing={!!editingId}
        disabled={noActivities}
        onToggle={() => (showForm ? closeForm() : startCreate())}
      />

      {noActivities && (
        <div className="glass-card p-5 mb-6 text-sm text-[var(--text-secondary)]">
          Create an activity first to start planning your day.
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${
          showForm ? "max-h-[700px] opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <PlanForm
          activities={activities}
          state={form}
          setState={setForm}
          onSubmit={onSubmit}
          onDelete={editingId ? onDelete : undefined}
          onCancel={closeForm}
          saving={saving}
          error={error}
          editing={!!editingId}
        />
      </div>

      {!noActivities && (
        <PlanTimeline
          plans={plans}
          activities={activities}
          selectedId={editingId}
          onSelect={startEdit}
          onAdd={startCreate}
          onAddAtHour={(hour) => {
            const startH = `${String(hour).padStart(2, "0")}:00`;
            const endH = `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`;
            startCreate({ startTime: startH, endTime: endH });
          }}
        />
      )}
    </div>
  );
}
