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
      <section>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Today's breakdown
        </h2>
        <div className="glass-card p-5 text-sm text-[var(--text-secondary)]">
          No sessions yet today — start the timer to see your breakdown here.
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Today's breakdown
      </h2>

      <div className="glass-card p-4 space-y-4">
        {/* Stacked bar */}
        <div className="flex h-2.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          {breakdown.map((d) => {
            const a = getActivity(d.activityId, activities);
            if (!a) return null;
            const pct = (d.seconds / totalSeconds) * 100;
            return (
              <div
                key={d.activityId}
                className="h-full"
                style={{ width: `${pct}%`, background: a.color }}
                title={`${a.name} — ${formatDuration(d.seconds)}`}
              />
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-2.5">
          {breakdown.map((d) => {
            const a = getActivity(d.activityId, activities);
            if (!a) return null;
            const pct = Math.round((d.seconds / totalSeconds) * 100);
            return (
              <div key={d.activityId} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: a.color }}
                />
                <span className="flex-1 text-sm font-medium truncate">
                  {a.icon} {a.name}
                </span>
                <div className="flex-1 h-1 rounded bg-[var(--bg-elevated)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: a.color }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)] tabular-nums w-14 text-right">
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
