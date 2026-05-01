import { DashboardSkeleton } from "@/components/skeletons/dashboardSkeleton";
import { DelayedSkeleton } from "@/components/skeletons/delayedSkeleton";

export default function Loading() {
  return (
    <DelayedSkeleton>
      <DashboardSkeleton />
    </DelayedSkeleton>
  );
}
