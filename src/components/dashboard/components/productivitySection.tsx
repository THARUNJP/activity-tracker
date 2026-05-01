export function ProductivitySection({ productive, leisure }: any) {
  return (
    <div className="glass-card mx-4 p-4">
      <div className="text-sm font-medium mb-3">
        Productive vs Leisure
      </div>

      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-[var(--green-dim)] p-3 text-center">
          <div className="text-lg font-semibold text-[var(--green)]">
            {productive}
          </div>
          <div className="text-xs text-[var(--green)]">Productive</div>
        </div>

        <div className="flex-1 rounded-lg bg-[var(--red-dim)] p-3 text-center">
          <div className="text-lg font-semibold text-[var(--red)]">
            {leisure}
          </div>
          <div className="text-xs text-[var(--red)]">Leisure</div>
        </div>
      </div>
    </div>
  );
}