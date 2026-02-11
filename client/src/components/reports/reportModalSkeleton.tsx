import { Skeleton } from "@/components/ui/skeleton";

function ReportModalSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`strength-${index}`} className="h-4 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`improve-${index}`} className="h-4 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`kpi-${index}`} className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`competency-${index}`} className="space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportModalSkeleton;
