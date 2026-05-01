"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar } from "lucide-react";

export function DatePopover({
  value,
  onChange,
  minDate,
  maxDate,
  align = "left",
}: {
  value: Date;
  onChange: (d: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  align?: "left" | "right";
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

  function handlePick(d: Date | undefined) {
    if (!d) return;
    onChange(d);
    setOpen(false);
  }

  const disabled = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] transition text-sm text-[var(--text-primary)]"
      >
        <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
        <span className="truncate">
          {value.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </button>

      {open && (
        <div
          className={`absolute z-30 mt-2 ${
            align === "right" ? "right-0" : "left-0"
          } rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2 shadow-2xl animate-fade-in`}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handlePick}
            showOutsideDays
            defaultMonth={value}
            disabled={disabled.length ? disabled : undefined}
          />
        </div>
      )}
    </div>
  );
}
