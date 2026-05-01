export function ChartSection({ total, periodLabel, children }: any) {
  return (
    <div className="glass-card mx-4 p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Time by activity</span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-lg font-semibold">{total}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {periodLabel}
        </span>
      </div>

      <div className="text-xs text-[var(--text-muted)] mb-3">
        {children?.sub}
      </div>

      <div className="h-40">{children?.chart}</div>

      <div className="flex flex-wrap gap-2 mt-3">
        {children?.legend}
      </div>
    </div>
  );
}