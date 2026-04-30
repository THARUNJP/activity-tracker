export function SchedulesHeader({
  showForm,
  disabled,
  onToggle,
}: {
  showForm: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Schedules</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Default time blocks for your activities
        </p>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span
          className={`inline-block transition-transform duration-200 ${
            showForm ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
        {showForm ? "Cancel" : "Add Schedule"}
      </button>
    </div>
  );
}
