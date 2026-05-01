import { Activity, DashboardEntry } from "@/types";
import { formatDuration, getActivity } from "@/lib/helper";

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() >= today.getTime()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getTime() >= yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function RecentSessions({
  entries,
  activities,
}: {
  entries: DashboardEntry[];
  activities: Activity[];
}) {
  const recent = entries.slice(0, 6);

  if (!recent.length) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Recent sessions
        </h2>
        <div className="glass-card p-5 text-sm text-[var(--text-secondary)]">
          No sessions yet. Run the timer to log your first one.
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Recent sessions
      </h2>

      <div className="flex flex-col gap-2">
        {recent.map((e) => {
          const a = getActivity(e.activity_id, activities);
          if (!a) return null;
          return (
            <div
              key={e.id}
              className="glass-card px-[18px] py-[12px] flex items-center gap-3.5"
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                style={{
                  background: `${a.color}20`,
                  border: `1px solid ${a.color}40`,
                }}
              >
                {a.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-[0.9rem] truncate">
                  {a.name}
                </div>
                <div className="text-[0.78rem] text-[var(--text-muted)] mt-[2px]">
                  {formatRelative(e.start_time)}
                </div>
              </div>

              <span
                className="text-sm font-semibold tabular-nums shrink-0"
                style={{ color: a.color }}
              >
                {formatDuration(e.duration_seconds ?? 0)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
