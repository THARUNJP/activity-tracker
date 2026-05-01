export function DayDetailSection({ data }: any) {
  return (
    <div className="glass-card mx-4 p-4">
      <div className="text-sm text-[var(--text-muted)] mb-3">
        Day details
      </div>

      <div className="space-y-2">
        {data.map((d: any) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: d.color }}
            />

            <div className="flex-1">
              <div className="text-xs font-medium">{d.name}</div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {d.type}
              </div>
            </div>

            <div className="flex-1 h-1 bg-[var(--bg-elevated)] rounded overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${d.pct}%`, background: d.color }}
              />
            </div>

            <span className="text-xs">{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}