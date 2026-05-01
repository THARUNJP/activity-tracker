export default function TodayStats({ stats }: any) {
  return (
    <div className="space-y-3">
      <div className="px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Today
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        {stats.map((s: any) => (
          <div
            key={s.label}
            className="glass-card rounded-xl p-3"
          >
            <div className="text-[11px] text-[var(--text-muted)] mb-1">
              {s.label}
            </div>

            <div className="text-lg font-semibold tracking-tight">
              {s.value}
            </div>

            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}