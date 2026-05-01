import type { Activity } from "@/types";

export function TimerChips({
  activities,
  selectedId,
  onSelect,
}: {
  activities: Activity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (activities.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--text-muted)]">
        Create an activity to start tracking.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 pb-1">
      {activities.map((activity) => {
        const isActive = selectedId === activity.id;
        return (
          <button
            key={activity.id}
            onClick={() => onSelect(activity.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "border-[color:var(--chip-color)] bg-[color:var(--chip-bg)] text-[color:var(--chip-color)]"
                : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
            }`}
            style={
              isActive
                ? ({
                    "--chip-color": activity.color,
                    "--chip-bg": `${activity.color}20`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <span>{activity.icon}</span>
            {activity.name}
          </button>
        );
      })}
    </div>
  );
}
