import { DelayedSkeleton } from "@/components/skeletons/delayedSkeleton";
import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <DelayedSkeleton>
      <ListPageSkeleton titleWidth="w-24" subtitleWidth="w-52" rows={3} />
    </DelayedSkeleton>
  );
}
