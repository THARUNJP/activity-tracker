import { DelayedSkeleton } from "@/components/skeletons/delayedSkeleton";
import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <DelayedSkeleton>
      <ListPageSkeleton titleWidth="w-32" subtitleWidth="w-56" rows={4} />
    </DelayedSkeleton>
  );
}
