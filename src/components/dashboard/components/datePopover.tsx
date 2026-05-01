"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar } from "lucide-react";
import { formatDateShort } from "@/lib/helper";

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
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: align === "right" ? rect.right : rect.left,
    });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScroll() {
      // Close on outside scroll — fixed positioning would otherwise drift
      if (popRef.current?.matches(":hover")) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
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

  const popover =
    open && pos ? (
      <div
        ref={popRef}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          transform: align === "right" ? "translateX(-100%)" : undefined,
          zIndex: 9999,
        }}
        className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2 shadow-2xl animate-fade-in"
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
    ) : null;

  return (
    <div className="w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] transition text-sm text-[var(--text-primary)]"
      >
        <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
        <span className="truncate">{formatDateShort(value, true)}</span>
      </button>

      {typeof document !== "undefined" && popover
        ? createPortal(popover, document.body)
        : null}
    </div>
  );
}
