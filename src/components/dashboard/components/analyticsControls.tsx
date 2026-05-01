import { AnalyticsPeriod, DateRange } from "@/types";
import { exclusiveEndDate, inclusiveEndDate } from "@/lib/helper";
import { DateRangePopover } from "./dateRangePopover";

const PERIODS: { id: AnalyticsPeriod; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "custom", label: "Custom" },
];

type Mode = "single" | "range";

export function AnalyticsControls({
  period,
  setPeriod,
  range,
  customRange,
  setCustomRange,
  customMode,
  setCustomMode,
}: {
  period: AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
  range: DateRange;
  customRange: DateRange;
  setCustomRange: (r: DateRange) => void;
  customMode: Mode;
  setCustomMode: (m: Mode) => void;
}) {
  function switchMode(next: Mode) {
    if (next === customMode) return;
    if (next === "single") {
      setCustomRange({
        start: customRange.start,
        end: exclusiveEndDate(customRange.start),
      });
    } else {
      const endIncl = new Date(customRange.start);
      endIncl.setDate(endIncl.getDate() + 6);
      setCustomRange({
        start: customRange.start,
        end: exclusiveEndDate(endIncl),
      });
    }
    setCustomMode(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Period tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              period === p.id
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "custom" ? (
        <div className="space-y-2">
          {/* Mode toggle */}
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => switchMode("single")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                customMode === "single"
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Single day
            </button>
            <button
              onClick={() => switchMode("range")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                customMode === "range"
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Date range
            </button>
          </div>

          <DateRangePopover
            mode={customMode}
            range={customRange}
            onChange={setCustomRange}
          />
        </div>
      ) : (
        <div className="text-[11px] text-[var(--text-muted)]">
          {range.start.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
          {" — "}
          {inclusiveEndDate(range.end).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
