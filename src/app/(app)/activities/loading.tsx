import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <ListPageSkeleton titleWidth="w-32" subtitleWidth="w-56" rows={4} />
  );
}
