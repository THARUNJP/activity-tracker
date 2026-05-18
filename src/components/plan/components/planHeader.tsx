export function PlanHeader({
  showForm,
  editing,
  disabled,
  onToggle,
}: {
  showForm: boolean;
  editing: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const label = showForm ? (editing ? "Close" : "Cancel") : "Add Block";

  return (
    <div className="flex items-center justify-between mb-4 gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight">Plan</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your ideal day, hour by hour. Tap any time slot to add a block.
        </p>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <span
          className={`inline-block transition-transform duration-200 ${
            showForm ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
        {label}
      </button>
    </div>
  );
}
