export function PeriodSection({ period, setPeriod, days, selectedDay, setDay }: any) {
  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 px-4">
        {["week", "month", "year"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs border
              ${
                period === p
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]"
              }
            `}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Days */}
      {period === "week" && (
        <div className="flex gap-1 overflow-x-auto px-4">
          {days.map((d: any, i: number) => (
            <button
              key={i}
              onClick={() => setDay(i)}
              className={`flex flex-col items-center rounded-md px-2 py-1 border text-xs
                ${
                  selectedDay === i
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]"
                }
              `}
            >
              <span>{d.label}</span>
              <span className="text-sm font-medium">{d.date}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}