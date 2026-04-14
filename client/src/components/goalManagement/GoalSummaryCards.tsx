import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import GoalsSummary from "./GoalsSummary";
import type { GetGoals } from "@/types/apiResponse";

function GoalSummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={`goal-summary-skeleton-${index}`}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function GoalSummaryCards({
  stats,
  isLoading = false,
}: {
  stats?: GetGoals["stats"];
  isLoading?: boolean;
}) {
  if (isLoading || !stats) {
    return <GoalSummaryCardsSkeleton />;
  }

  return (
    <>
      <GoalsSummary
        notStartedGoals={stats.notStartedGoals}
        completedGoals={stats.completedGoals}
        atRiskGoals={stats.atRiskGoals}
        onTrackGoals={stats.onTrackGoals}
        incompleteGoals={stats.incompleteGoals}
      />
    </>
  );
}

export default GoalSummaryCards;
