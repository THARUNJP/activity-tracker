import { Activity, TodaySummary } from "@/types";
import { formatDuration, getActivity } from "@/lib/helper";

export default function BreakdownSection({
  summary,
  activities,
}: {
  summary: TodaySummary;
  activities: Activity[];
}) {
  const { breakdown, totalSeconds } = summary;

  if (!breakdown.length) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
          Today&apos;s breakdown
        </h2>

        <div className="glass-card p-5 text-sm text-[var(--text-muted)]">
          No sessions yet today — start the timer to see your breakdown.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {/* Title */}
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">
        Today&apos;s breakdown
      </h2>

      <div className="glass-card p-4 space-y-4">
        {/* TOP STACKED BAR */}
        <div className="flex h-2 rounded-full overflow-hidden bg-[var(--bg-elevated)]">
          {breakdown.map((d) => {
            const a = getActivity(d.activityId, activities);
            if (!a) return null;

            const pct = (d.seconds / totalSeconds) * 100;

            return (
              <div
                key={d.activityId}
                style={{
                  width: `${pct}%`,
                  background: a.color,
                }}
              />
            );
          })}
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {breakdown.map((d) => {
            const a = getActivity(d.activityId, activities);
            if (!a) return null;

            const pct = Math.round((d.seconds / totalSeconds) * 100);

            return (
              <div key={d.activityId} className="flex items-center gap-3">
                {/* DOT */}
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: a.color }}
                />

                {/* NAME */}
                <span className="w-[120px] text-sm text-[var(--text-primary)]">
                  {a.name}
                </span>

                {/* BAR */}
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: a.color,
                    }}
                  />
                </div>

                {/* TIME */}
                <span className="w-[60px] text-right text-sm text-[var(--text-secondary)] tabular-nums">
                  {formatDuration(d.seconds)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
