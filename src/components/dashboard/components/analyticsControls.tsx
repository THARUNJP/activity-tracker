import { useMemo } from "react";
import { AnalyticsPeriod, DateRange } from "@/types";
import {
  exclusiveEndDate,
  fromDateInputValue,
  inclusiveEndDate,
  toDateInputValue,
} from "@/lib/helper";

const PERIODS: { id: AnalyticsPeriod; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "custom", label: "Custom" },
];

export function AnalyticsControls({
  period,
  setPeriod,
  range,
  customRange,
  setCustomRange,
}: {
  period: AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
  range: DateRange;
  customRange: DateRange;
  setCustomRange: (r: DateRange) => void;
}) {
  const startStr = toDateInputValue(customRange.start);
  const endInclusiveStr = toDateInputValue(inclusiveEndDate(customRange.end));
  const isSingleDay = useMemo(
    () => startStr === endInclusiveStr,
    [startStr, endInclusiveStr],
  );

  function setStart(value: string) {
    const start = fromDateInputValue(value);
    const endIncl = isSingleDay ? start : inclusiveEndDate(customRange.end);
    const safeEndIncl = endIncl < start ? start : endIncl;
    setCustomRange({ start, end: exclusiveEndDate(safeEndIncl) });
  }

  function setEndInclusive(value: string) {
    const endIncl = fromDateInputValue(value);
    const start = endIncl < customRange.start ? endIncl : customRange.start;
    setCustomRange({ start, end: exclusiveEndDate(endIncl) });
  }

  function setSingleDay(value: string) {
    const d = fromDateInputValue(value);
    setCustomRange({ start: d, end: exclusiveEndDate(d) });
  }

  function toggleSingleDay(next: boolean) {
    if (next) {
      // collapse to single day = start
      setCustomRange({
        start: customRange.start,
        end: exclusiveEndDate(customRange.start),
      });
    } else {
      // expand to a 7-day window ending today (or just open second input)
      const endIncl = new Date(customRange.start);
      endIncl.setDate(endIncl.getDate() + 6);
      setCustomRange({
        start: customRange.start,
        end: exclusiveEndDate(endIncl),
      });
    }
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
          {/* Single day vs range toggle */}
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => toggleSingleDay(true)}
              className={`px-3 py-1 rounded-md font-medium transition ${
                isSingleDay
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Single day
            </button>
            <button
              onClick={() => toggleSingleDay(false)}
              className={`px-3 py-1 rounded-md font-medium transition ${
                !isSingleDay
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Date range
            </button>
          </div>

          {isSingleDay ? (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Date
              </label>
              <input
                type="date"
                value={startStr}
                onChange={(e) => setSingleDay(e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={startStr}
                  max={endInclusiveStr}
                  onChange={(e) => setStart(e.target.value)}
                  className="input-field text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={endInclusiveStr}
                  min={startStr}
                  onChange={(e) => setEndInclusive(e.target.value)}
                  className="input-field text-sm w-full"
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
