"use client";

import { useMemo, useRef, useEffect } from "react";
import { ActivityTarget, Plan } from "@/types";
import { formatTime, getActivity } from "@/lib/helper";

// "HH:MM" or "HH:MM:SS" -> hours as decimal (9:30 -> 9.5)
function timeToHours(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) + (m ?? 0) / 60;
}

function formatHourLabel(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function formatBlockTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const suffix = h < 12 ? "am" : "pm";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  if (m === 0) return `${displayH}${suffix}`;
  return `${displayH}:${String(m).padStart(2, "0")}${suffix}`;
}

const HOUR_HEIGHT = 56; // px — one row per hour
const TOTAL_HOURS = 24;

interface Block {
  plan: Plan;
  activity: ActivityTarget;
  top: number;
  height: number;
}

export function PlanTimeline({
  plans,
  activities,
  selectedId,
  onSelect,
  onAddAtHour,
}: {
  plans: Plan[];
  activities: ActivityTarget[];
  selectedId: string | null;
  onSelect: (p: Plan) => void;
  onAdd: () => void;
  onAddAtHour: (hour: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const blocks = useMemo<Block[]>(() => {
    return plans
      .map((p) => {
        const activity = getActivity(p.activity_id, activities);
        if (!activity) return null;
        const startH = timeToHours(p.start_time);
        const endH = timeToHours(p.end_time);
        return {
          plan: p,
          activity,
          top: startH * HOUR_HEIGHT,
          height: Math.max((endH - startH) * HOUR_HEIGHT, 26),
        } as Block;
      })
      .filter((b): b is Block => b !== null);
  }, [plans, activities]);

  // On first mount, scroll to the earliest block (or 6 AM by default).
  useEffect(() => {
    if (!scrollerRef.current) return;
    const earliest = plans.length
      ? Math.min(...plans.map((p) => timeToHours(p.start_time)))
      : 6;
    const target = Math.max(0, (earliest - 1) * HOUR_HEIGHT);
    scrollerRef.current.scrollTo({ top: target, behavior: "auto" });
    // Run only once on mount; subsequent edits shouldn't jump scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-card overflow-hidden flex-1 min-h-0 flex flex-col">
      <div
        ref={scrollerRef}
        className="overflow-y-auto flex-1 min-h-0"
      >
        <div
          className="relative"
          style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}
        >
          {/* Hour rows */}
          {Array.from({ length: TOTAL_HOURS }, (_, h) => (
            <button
              key={h}
              type="button"
              onClick={() => onAddAtHour(h)}
              className="group absolute left-0 right-0 flex items-start cursor-pointer text-left"
              style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              aria-label={`Add block at ${formatHourLabel(h)}`}
            >
              <div className="w-14 sm:w-20 shrink-0 pl-2 sm:pl-3 pt-1 pr-2 text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] select-none">
                {formatHourLabel(h)}
              </div>
              <div className="flex-1 h-full border-t border-[var(--border)] group-hover:bg-[var(--accent-soft)] transition-colors" />
            </button>
          ))}

          {/* Half-hour faint lines */}
          {Array.from({ length: TOTAL_HOURS }, (_, h) => (
            <div
              key={`half-${h}`}
              className="absolute left-14 sm:left-20 right-0 border-t border-dashed border-[var(--border)] opacity-40 pointer-events-none"
              style={{ top: h * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
            />
          ))}

          {/* Plan blocks */}
          {blocks.map((b) => {
            const isSelected = selectedId === b.plan.id;
            return (
              <button
                key={b.plan.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(b.plan);
                }}
                className={`absolute left-14 sm:left-20 right-2 sm:right-3 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-left overflow-hidden transition-all duration-150 z-20 ${
                  isSelected
                    ? "ring-2 ring-white/80 scale-[1.01]"
                    : "hover:brightness-125 hover:z-30"
                }`}
                style={{
                  top: b.top + 2,
                  height: b.height - 4,
                  background: `${b.activity.color}26`,
                  border: `1px solid ${b.activity.color}`,
                  color: b.activity.color,
                }}
                title={`${b.activity.icon} ${b.activity.name}  •  ${formatTime(b.plan.start_time)} – ${formatTime(b.plan.end_time)}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-[12px]"
                    style={{
                      background: b.activity.color,
                      color: "#fff",
                    }}
                    aria-hidden
                  >
                    {b.activity.icon}
                  </span>
                  <div className="min-w-0 flex-1 flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-semibold text-[12px] sm:text-[13px] truncate">
                      {b.activity.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] opacity-80 whitespace-nowrap">
                      {formatBlockTime(b.plan.start_time)} –{" "}
                      {formatBlockTime(b.plan.end_time)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
