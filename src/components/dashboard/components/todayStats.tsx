import { TodaySummary } from "@/types";
import { formatDuration } from "@/lib/helper";

export default function TodayStats({ summary }: { summary: TodaySummary }) {
  const { totalSeconds, productiveSeconds, leisureSeconds, sessions } = summary;
  const productiveScore =
    totalSeconds > 0 ? Math.round((productiveSeconds / totalSeconds) * 100) : 0;

  const cards = [
    {
      label: "Total tracked",
      value: totalSeconds > 0 ? formatDuration(totalSeconds) : "0m",
      sub: `${sessions} session${sessions === 1 ? "" : "s"}`,
    },
    {
      label: "Productive",
      value:
        productiveSeconds > 0 ? formatDuration(productiveSeconds) : "0m",
      sub: `${productiveScore}% of today`,
      tone: "var(--green)",
    },
    {
      label: "Leisure",
      value: leisureSeconds > 0 ? formatDuration(leisureSeconds) : "0m",
      sub: totalSeconds > 0 ? `${100 - productiveScore}% of today` : "—",
      tone: "var(--red)",
    },
    {
      label: "Top streak",
      value: summary.breakdown[0]
        ? formatDuration(summary.breakdown[0].seconds)
        : "—",
      sub: summary.breakdown[0] ? "longest activity" : "no entries yet",
    },
  ];

  return (
    <section>
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Today
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-3">
            <div className="text-[11px] text-[var(--text-muted)] mb-1">
              {c.label}
            </div>
            <div
              className="text-lg font-bold tracking-tight"
              style={c.tone ? { color: c.tone } : undefined}
            >
              {c.value}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
