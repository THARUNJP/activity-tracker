import type { Activity } from "@/types";
import { formatTimer } from "@/lib/helper";

type State = "running" | "paused" | "ready";

const STATE_COLOR: Record<State, string> = {
  running: "text-[var(--text-primary)]",
  paused: "text-[var(--accent)]",
  ready: "text-[var(--text-muted)]",
};

export function TimerDisplay({
  seconds,
  state,
  activity,
}: {
  seconds: number;
  state: State;
  activity: Activity | undefined;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {state === "running" && (
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--green)]" />
        )}
        {state === "running" ? "Recording" : state === "paused" ? "Paused" : "Ready"}
      </div>

      <div
        className={`font-mono font-bold tabular-nums tracking-tight leading-none transition-colors duration-300 text-5xl sm:text-6xl md:text-7xl ${STATE_COLOR[state]}`}
        style={{ fontFamily: "Space Mono, monospace" }}
      >
        {formatTimer(seconds)}
      </div>

      {activity && (
        <div
          className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
          style={{
            background: `${activity.color}20`,
            color: activity.color,
            border: `1px solid ${activity.color}40`,
          }}
        >
          <span>{activity.icon}</span>
          {activity.name}
        </div>
      )}
    </div>
  );
}
