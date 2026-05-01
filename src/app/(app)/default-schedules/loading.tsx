import { DelayedSkeleton } from "@/components/skeletons/delayedSkeleton";
import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <DelayedSkeleton>
      <ListPageSkeleton titleWidth="w-44" subtitleWidth="w-60" rows={3} />
    </DelayedSkeleton>
  );
}
