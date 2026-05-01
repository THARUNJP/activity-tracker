"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AnalyticsBucket } from "@/types";
import { formatDuration } from "@/lib/helper";

interface Props {
  buckets: AnalyticsBucket[];
  activities: Activity[];
}

interface TooltipItem {
  dataKey: string;
  value: number;
}

function buildTooltip(activities: Activity[]) {
  // recharts v3 typings are noisy — props are passed in by recharts
  // and matched at runtime. We type the body, not the wrapper.
  return function TooltipContent(props: {
    active?: boolean;
    label?: string | number;
    payload?: TooltipItem[];
  }) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    const items = payload.filter((p) => Number(p.value) > 0);
    if (!items.length) return null;
    const total = items.reduce((s, p) => s + Number(p.value ?? 0), 0);

    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs shadow-lg">
        <div className="font-semibold text-[var(--text-primary)] mb-1">
          {label} • {formatDuration(total)}
        </div>
        <div className="space-y-1">
          {items
            .sort((a, b) => Number(b.value) - Number(a.value))
            .map((p) => {
              const a = activities.find((x) => x.id === p.dataKey);
              return (
                <div key={p.dataKey} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: a?.color ?? "var(--text-muted)" }}
                  />
                  <span className="text-[var(--text-secondary)] flex-1">
                    {a?.icon} {a?.name ?? "Unknown"}
                  </span>
                  <span className="text-[var(--text-primary)] font-semibold tabular-nums">
                    {formatDuration(Number(p.value))}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  };
}

export function AnalyticsChart({ buckets, activities }: Props) {
  const used = activities.filter((a) =>
    buckets.some((b) => Number(b[a.id] ?? 0) > 0),
  );

  return (
    <div className="h-56 sm:h-64 w-full">
      <ResponsiveContainer>
        <BarChart
          data={buckets}
          margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 3600 ? `${Math.round(v / 3600)}h` : `${Math.round(v / 60)}m`
            }
            width={40}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={buildTooltip(activities) as never}
          />
          {used.map((a, i) => (
            <Bar
              key={a.id}
              dataKey={a.id}
              stackId="acts"
              fill={a.color}
              radius={
                i === used.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
