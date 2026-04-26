import { Activity } from "@/types";

export function ActivityRow({
  activity,
  canDelete,
  onDelete,
}: {
  activity: Activity;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="glass-card px-[18px] py-[14px] flex items-center gap-3.5">
      {/* Icon box */}
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg shrink-0"
        style={{
          background: `${activity.color}20`,
          border: `1px solid ${activity.color}40`,
        }}
      >
        {activity.icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="font-bold text-[0.95rem]">{activity.name}</div>

        <div className="text-[0.78rem] text-[var(--text-muted)] mt-[2px]">
          {activity.is_productive ? "✦ Productive" : "◌ Leisure"}
          {activity.is_default && " · Default"}
        </div>
      </div>

      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ background: activity.color }}
      />

      {/* Delete */}
      {canDelete && (
        <button
          onClick={onDelete}
          className="text-sm text-[var(--text-muted)] px-1.5 py-1 rounded-md transition
                   hover:bg-[var(--bg-elevated)] hover:text-red-400"
        >
          ✕
        </button>
      )}
    </div>
  );
}
