"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange as RDPRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar } from "lucide-react";
import { DateRange } from "@/types";
import { exclusiveEndDate, inclusiveEndDate } from "@/lib/helper";

type Mode = "single" | "range";

function formatLabel(mode: Mode, range: DateRange): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (mode === "single") return fmt(range.start);
  return `${fmt(range.start)} → ${fmt(inclusiveEndDate(range.end))}`;
}

export function DateRangePopover({
  mode,
  range,
  onChange,
}: {
  mode: Mode;
  range: DateRange;
  onChange: (next: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function handleSingle(d: Date | undefined) {
    if (!d) return;
    onChange({ start: d, end: exclusiveEndDate(d) });
    setOpen(false);
  }

  function handleRange(r: RDPRange | undefined) {
    if (!r?.from) return;
    if (!r.to) {
      // first click: keep popover open until user picks the end
      onChange({ start: r.from, end: exclusiveEndDate(r.from) });
      return;
    }
    const start = r.from < r.to ? r.from : r.to;
    const inclusiveEnd = r.from < r.to ? r.to : r.from;
    onChange({ start, end: exclusiveEndDate(inclusiveEnd) });
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] transition text-sm text-[var(--text-primary)]"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
          <span className="truncate">{formatLabel(mode, range)}</span>
        </span>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider shrink-0">
          {mode === "single" ? "Day" : "Range"}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 right-0 sm:left-0 sm:right-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2 shadow-2xl animate-fade-in">
          {mode === "single" ? (
            <DayPicker
              mode="single"
              selected={range.start}
              onSelect={handleSingle}
              showOutsideDays
              defaultMonth={range.start}
            />
          ) : (
            <DayPicker
              mode="range"
              selected={{ from: range.start, to: inclusiveEndDate(range.end) }}
              onSelect={handleRange}
              showOutsideDays
              numberOfMonths={1}
              defaultMonth={range.start}
            />
          )}
        </div>
      )}
    </div>
  );
}
