import Api from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import GoalsSummary from "./GoalsSummary";
import ApiErrorMessage from "../ApiErrorMessage";

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

function GoalSummaryCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionCard"],
    queryFn: () => Api.getGoalCardStatus(),
  });
  let summaryData;

  if (isLoading || !data?.stats) {
    return <GoalSummaryCardsSkeleton />;
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  if (data?.stats) {
    summaryData = data.stats;
  }

  return (
    <>
      <GoalsSummary
        notStartedGoals={summaryData?.notStartedGoals ?? 0}
        completedGoals={summaryData?.completedGoals ?? 0}
        atRiskGoals={summaryData?.atRiskGoals ?? 0}
        onTrackGoals={summaryData?.onTrackGoals ?? 0}
      />
    </>
  );
}

export default GoalSummaryCards;
