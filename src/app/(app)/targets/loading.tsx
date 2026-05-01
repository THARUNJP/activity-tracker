import { ListPageSkeleton } from "@/components/skeletons/listPageSkeleton";

export default function Loading() {
  return (
    <ListPageSkeleton titleWidth="w-24" subtitleWidth="w-52" rows={3} />
  );
}
