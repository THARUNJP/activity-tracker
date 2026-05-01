export default function BreakdownSection({ data, activities }: any) {
  const total = data.reduce((s: number, d: any) => s + d.seconds, 0);

  return (
    <div className="glass-card mx-4 p-4 space-y-3">
      <div className="text-sm font-medium">Today's breakdown</div>

      {/* Top bar */}
      <div className="flex h-2 overflow-hidden rounded bg-[var(--bg-elevated)]">
        {data.map((d: any) => {
          const a = activities.find((x: any) => x.id === d.id);
          const pct = (d.seconds / total) * 100;

          return (
            <div
              key={d.id}
              className="h-full"
              style={{ width: `${pct}%`, background: a.color }}
            />
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {data.map((d: any) => {
          const a = activities.find((x: any) => x.id === d.id);
          const pct = (d.seconds / total) * 100;

          return (
            <div key={d.id} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: a.color }}
              />

              <span className="flex-1 text-xs">{a.name}</span>

              <div className="flex-1 h-1 rounded bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${pct}%`, background: a.color }}
                />
              </div>

              <span className="text-xs text-[var(--text-muted)]">
                {Math.round(d.seconds / 60)}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}