export function ProductivitySection({
  productiveSeconds,
  leisureSeconds,
}: {
  productiveSeconds: number;
  leisureSeconds: number;
}) {
  function format(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">
        Productive vs leisure
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* PRODUCTIVE */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-5 text-center relative overflow-hidden">
          {/* subtle glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[rgb(16,185,129)]" />
            <span className="text-xs text-[var(--text-muted)]">Productive</span>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {format(productiveSeconds)}
          </div>
        </div>

        {/* LEISURE */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-5 text-center relative overflow-hidden">
          {/* subtle glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.08),transparent_70%)] pointer-events-none" />

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[rgb(239,68,68)]" />
            <span className="text-xs text-[var(--text-muted)]">Leisure</span>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {format(leisureSeconds)}
          </div>
        </div>
      </div>
    </section>
  );
}
