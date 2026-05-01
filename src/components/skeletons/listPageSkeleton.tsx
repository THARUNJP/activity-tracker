import { Skeleton } from "./skeleton";

function SkeletonRow() {
  return (
    <div className="glass-card px-[18px] py-[14px] flex items-center gap-3.5">
      <Skeleton className="w-9 h-9 rounded-[10px] shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-3 rounded-full shrink-0" />
      <Skeleton className="h-4 w-4 rounded shrink-0" />
    </div>
  );
}

export function ListPageSkeleton({
  titleWidth = "w-32",
  subtitleWidth = "w-48",
  rows = 4,
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  rows?: number;
}) {
  return (
    <div className="animate-fade-in max-w-[820px] w-full mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className={`h-7 ${titleWidth}`} />
          <Skeleton className={`h-3.5 ${subtitleWidth}`} />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Section label */}
      <Skeleton className="h-3 w-20 mb-3" />

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}
