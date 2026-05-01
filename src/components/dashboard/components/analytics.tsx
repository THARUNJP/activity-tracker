"use client";

import { useMemo, useState } from "react";
import { Activity, AnalyticsPeriod, DashboardEntry, DateRange } from "@/types";
import {
  bucketByActivity,
  bucketEntries,
  formatDuration,
  getRangeForPeriod,
  startOfToday,
  totalInRange,
} from "@/lib/helper";
import { AnalyticsControls } from "./analyticsControls";
import { AnalyticsChart } from "./analyticsChart";

function defaultCustomRange(): DateRange {
  const end = new Date(startOfToday());
  end.setDate(end.getDate() + 1); // exclusive: include today
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  return { start, end };
}

export function AnalyticsSection({
  entries,
  activities,
}: {
  entries: DashboardEntry[];
  activities: Activity[];
}) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");
  const [customRange, setCustomRange] = useState<DateRange>(
    defaultCustomRange(),
  );
  const [customMode, setCustomMode] = useState<"single" | "range">("range");

  const range = useMemo(
    () => getRangeForPeriod(period, customRange),
    [period, customRange],
  );

  const isSingleDay = period === "custom" && customMode === "single";

  const buckets = useMemo(
    () =>
      isSingleDay
        ? bucketByActivity(entries, range, activities)
        : bucketEntries(entries, range, activities),
    [isSingleDay, entries, range, activities],
  );

  const total = useMemo(() => totalInRange(entries, range), [entries, range]);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Analytics
        </h2>
        <span className="text-xs text-[var(--text-muted)]">
          Total{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {total > 0 ? formatDuration(total) : "0m"}
          </span>
        </span>
      </div>

      <div className="glass-card p-4 sm:p-5 space-y-4">
        <AnalyticsControls
          period={period}
          setPeriod={setPeriod}
          range={range}
          customRange={customRange}
          setCustomRange={setCustomRange}
          customMode={customMode}
          setCustomMode={setCustomMode}
        />

        {total === 0 ? (
          <div className="h-56 sm:h-64 flex items-center justify-center text-sm text-[var(--text-muted)]">
            No activity in this range.
          </div>
        ) : (
          <AnalyticsChart buckets={buckets} activities={activities} />
        )}

        {/* Legend */}
        {total > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-[var(--border)]">
            {activities
              .filter((a) =>
                buckets.some((b) => Number(b[a.id] ?? 0) > 0),
              )
              .map((a) => (
                <div key={a.id} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: a.color }}
                  />
                  <span className="text-xs text-[var(--text-secondary)]">
                    {a.icon} {a.name}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
