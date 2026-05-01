import { Skeleton } from "./skeleton";

function SkeletonRow() {
  return (
    <div className="glass-card px-[18px] py-[14px] flex items-center gap-3.5">
      <Skeleton className="w-9 h-9 rounded-[10px] shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

function SectionTitle({ width = "w-32" }: { width?: string }) {
  return <Skeleton className={`h-3 ${width} mb-3`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in max-w-[900px] mx-auto w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Timer card */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-14 w-64" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[80, 96, 88, 104, 72].map((w, i) => (
            <Skeleton
              key={i}
              className="h-7 rounded-full shrink-0"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        <div className="flex justify-center gap-2.5">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Today stats */}
      <section>
        <SectionTitle width="w-12" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-3 space-y-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-2.5 w-14" />
            </div>
          ))}
        </div>
      </section>

      {/* Breakdown */}
      <section>
        <SectionTitle width="w-32" />
        <div className="glass-card p-4 space-y-4">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="flex-1 h-1.5 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <div className="flex justify-between mb-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="glass-card p-4 sm:p-5 space-y-4">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-56 sm:h-64 w-full rounded-md" />
        </div>
      </section>

      {/* Productivity */}
      <section>
        <SectionTitle width="w-36" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl px-4 py-5 text-center space-y-2"
            >
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-7 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Targets */}
      <section>
        <SectionTitle width="w-20" />
        <div className="flex flex-col gap-2">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </section>
    </div>
  );
}
