import { Activity, TargetProgress } from "@/types";
import { formatDuration, getActivity } from "@/lib/helper";

const PERIOD_LABEL: Record<string, string> = {
  daily: "Today",
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
};

export function TargetsSection({
  targets,
  activities,
}: {
  targets: TargetProgress[];
  activities: Activity[];
}) {
  if (!targets.length) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Targets
        </h2>
        <div className="glass-card p-5 text-sm text-[var(--text-secondary)]">
          No targets set. Head to the Targets page to add one.
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Targets
      </h2>

      <div className="glass-card p-4 space-y-4">
        {targets.map(({ target, achievedSeconds }) => {
          const a = getActivity(target.activity_id, activities);
          if (!a) return null;
          const pct = Math.min(
            100,
            Math.round((achievedSeconds / target.target_seconds) * 100),
          );
          const reached = achievedSeconds >= target.target_seconds;

          return (
            <div key={target.id} className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0 text-base"
                style={{
                  background: `${a.color}20`,
                  border: `1px solid ${a.color}40`,
                }}
              >
                {a.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold truncate">
                    {a.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] shrink-0">
                    {PERIOD_LABEL[target.period]} •{" "}
                    {formatDuration(achievedSeconds)} /{" "}
                    {formatDuration(target.target_seconds)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: reached ? "var(--green)" : a.color,
                    }}
                  />
                </div>
              </div>

              <span
                className="text-xs font-bold tabular-nums w-10 text-right"
                style={{ color: reached ? "var(--green)" : a.color }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
