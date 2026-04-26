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
    <div
      className="glass-card"
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: `${activity.color}20`,
          border: `1px solid ${activity.color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {activity.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>
          {activity.name}
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          {activity.is_productive ? "✦ Productive" : "◌ Leisure"}
          {activity.is_default && " · Default"}
        </div>
      </div>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: activity.color,
          flexShrink: 0,
        }}
      />
      {canDelete && (
        <button
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "14px",
            padding: "4px 6px",
            borderRadius: "6px",
            transition: "color 0.15s",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
