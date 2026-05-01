import { DashboardData } from "@/types";

export const COLORS = [
  "#7c6af7",
  "#22d3ee",
  "#4ade80",
  "#fb923c",
  "#f472b6",
  "#f87171",
  "#fbbf24",
  "#a78bfa",
  "#34d399",
  "#60a5fa",
];
export const ICONS = [
  "💼",
  "📚",
  "😴",
  "🏃",
  "🎮",
  "⏳",
  "🎨",
  "🍳",
  "📱",
  "✈️",
  "🎵",
  "🧘",
  "💪",
  "📝",
  "🎯",
];

// mock/dashboardData.ts

export const dashboardData: DashboardData = {
  today: {
    totalSeconds: 22800, // 6h 20m
    productiveSeconds: 17100,
    sessions: 8,
    longestSession: {
      seconds: 5400,
      activityId: "1",
    },
    breakdown: [
      { activityId: "1", seconds: 17100 },
      { activityId: "2", seconds: 5400 },
      { activityId: "3", seconds: 3600 },
    ],
  },

  targets: [
    {
      activityId: "1",
      targetSeconds: 24000,
      achievedSeconds: 18000,
    },
    {
      activityId: "2",
      targetSeconds: 6000,
      achievedSeconds: 4200,
    },
    {
      activityId: "3",
      targetSeconds: 8000,
      achievedSeconds: 3000,
    },
  ],
};
