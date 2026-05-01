import { AnalyticsPeriod, DateRange } from "@/types";
import { exclusiveEndDate, inclusiveEndDate } from "@/lib/helper";
import { DatePopover } from "./datePopover";

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
  const inclusiveEnd = inclusiveEndDate(customRange.end);

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

  function setSingle(d: Date) {
    setCustomRange({ start: d, end: exclusiveEndDate(d) });
  }

  function setRangeStart(d: Date) {
    // If new start is after current end, push end forward to match
    const endIncl = inclusiveEnd < d ? d : inclusiveEnd;
    setCustomRange({ start: d, end: exclusiveEndDate(endIncl) });
  }

  function setRangeEnd(d: Date) {
    // If new end is before current start, pull start back to match
    const start = d < customRange.start ? d : customRange.start;
    setCustomRange({ start, end: exclusiveEndDate(d) });
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

          {customMode === "single" ? (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Date
              </label>
              <DatePopover value={customRange.start} onChange={setSingle} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Start date
                </label>
                <DatePopover
                  value={customRange.start}
                  onChange={setRangeStart}
                  align="left"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  End date
                </label>
                <DatePopover
                  value={inclusiveEnd}
                  onChange={setRangeEnd}
                  minDate={customRange.start}
                  align="right"
                />
              </div>
            </div>
          )}
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
