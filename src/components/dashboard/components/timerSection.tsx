export function TimerSection({
  activities,
  selectedActivity,
  onSelectActivity,
  isRunning,
  displayTime,
  onToggle,
  note,
  onNoteChange,
}: any) {
  return (
    <div className="space-y-3">
      {/* Section Label */}
      <div className="px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Timer
      </div>

      {/* Activity Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 scrollbar-none">
        {activities.map((a: any) => {
          const active = selectedActivity?.id === a.id;

          return (
            <button
              key={a.id}
              onClick={() => onSelectActivity(a)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition
                ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
                }
              `}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: a.color }}
              />
              {a.name}
            </button>
          );
        })}
      </div>

      {/* Timer Card */}
      <div className="glass-card mx-4 overflow-hidden">
        {/* Activity Row */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: selectedActivity?.color }}
          />

          <span className="flex-1 text-sm font-medium">
            {selectedActivity?.name}
          </span>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium
              ${
                selectedActivity?.productivity === "productive"
                  ? "bg-[var(--green-dim)] text-[var(--green)]"
                  : "bg-[var(--red-dim)] text-[var(--red)]"
              }
            `}
          >
            {selectedActivity?.productivity === "productive"
              ? "Productive"
              : "Leisure"}
          </span>
        </div>

        {/* Timer Display */}
        <div className="px-4 py-5 text-center">
          <div
            className={`font-mono text-5xl font-light tracking-tight tabular-nums
              ${isRunning ? "text-[var(--accent)]" : ""}
            `}
            style={{ fontFamily: "Space Mono, monospace" }}
          >
            {displayTime}
          </div>

          <div className="mt-1 text-[11px] text-[var(--text-muted)]">
            {isRunning ? "Running..." : "Ready to start"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onNoteChange}
            className="flex-1 truncate rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-left text-xs text-[var(--text-secondary)]"
          >
            {note}
          </button>

          <button
            onClick={onToggle}
            className={`rounded-lg px-5 py-2 text-sm font-medium text-white transition
              ${
                isRunning
                  ? "bg-[var(--red)]"
                  : "bg-[var(--accent)] hover:opacity-90"
              }
            `}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}