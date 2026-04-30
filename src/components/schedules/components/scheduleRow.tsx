import { ActivityTarget, Schedule } from "@/types";
import { formatDays, formatTime } from "@/lib/helper";

export function ScheduleRow({
  schedule,
  activity,
  onDelete,
}: {
  schedule: Schedule;
  activity: ActivityTarget;
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
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[0.95rem] truncate">{activity.name}</div>
        <div className="text-[0.78rem] text-[var(--text-muted)] mt-[2px]">
          🕒 {formatTime(schedule.start_time)} →{" "}
          {formatTime(schedule.end_time)} • {formatDays(schedule.days_of_week)}
        </div>
      </div>

      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ background: activity.color }}
      />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="text-sm text-[var(--text-muted)] px-1.5 py-1 rounded-md transition
                 hover:bg-[var(--bg-elevated)] hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
}
