import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <ListPageSkeleton titleWidth="w-44" subtitleWidth="w-60" rows={3} />
  );
}
