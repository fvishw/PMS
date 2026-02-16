import Api from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import GoalsSummary from "./GoalsSummary";

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
  const { data: cardSummary, isLoading } = useQuery({
    queryKey: ["sectionCard"],
    queryFn: () => Api.getGoalCardStatus(),
  });

  if (isLoading || !cardSummary?.stats) {
    return <GoalSummaryCardsSkeleton />;
  }

  const summary = {
    totalGoals: cardSummary?.stats?.totalGoals ?? 0,
    completedGoals: cardSummary?.stats?.completedGoals ?? 0,
    onTrackGoals:
      (cardSummary?.stats?.totalGoals ?? 0) -
      (cardSummary?.stats?.completedGoals ?? 0),
  };
  return (
    <>
      <GoalsSummary
        totalGoals={summary.totalGoals}
        onTrackGoals={summary.onTrackGoals}
        completedGoals={summary.completedGoals}
      />
    </>
  );
}

export default GoalSummaryCards;
