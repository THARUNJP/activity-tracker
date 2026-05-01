export function TargetsSection({ targets }: any) {
  return (
    <div className="space-y-3">
      <div className="px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Weekly Targets
      </div>

      <div className="glass-card mx-4 p-4 space-y-3">
        {targets.map((t: any) => (
          <div key={t.name} className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{ background: `${t.color}22` }}
            >
              {t.icon}
            </div>

            <div className="flex-1">
              <div className="text-xs font-medium">{t.name}</div>

              <div className="h-1 mt-1 rounded bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${t.pct}%`,
                    background: t.color,
                  }}
                />
              </div>
            </div>

            <span className="text-xs text-[var(--text-muted)]">
              {t.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}