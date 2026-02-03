import { IconChecks, IconTargetArrow, IconUser } from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuthContext";
import Api from "@/api/api";
import { Spinner } from "./ui/spinner";
import ApiErrorMessage from "./ApiErrorMessage";

export function SectionCards() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["sectionCard", user?._id],
    queryFn: () => Api.getDashboardCardStatus(),
  });

  if (isLoading) {
    return (
      <div className="w-full  rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message || "An error occurred"} />;
  }

  if (data) {
    const stats = data?.stats;

    const totalCompletedReview = stats?.totalCompletedReview ?? 0;
    const totalMasterPerformanceTemplate =
      stats?.totalMasterPerformanceTemplate ?? 0;
    const totalUser = stats?.totalUser ?? 0;

    const dashBoardCards = [
      {
        id: "total-performance-templates",
        title: "Total Performance Templates",
        value: totalMasterPerformanceTemplate,
        icon: IconTargetArrow,
        highlightText: "Total templates created",
        subText: "Performance templates in system",
      },
      {
        id: "total-users",
        title: "Total Users",
        value: totalUser,
        icon: IconUser,
        highlightText: "Active employees this cycle",
        subText: "Total employees in the system",
      },
      {
        id: "completed-reviews",
        title: "Completed Reviews",
        value: totalCompletedReview,
        icon: IconChecks,
        highlightText: "On track for current cycle",
        subText: "Completed employee reviews",
      },
    ];

    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {dashBoardCards.map((card) => (
          <Card className="@container/card" key={card.id} data-slot="card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <card.icon className="stroke-primary" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.highlightText}
              </div>
              <div className="text-muted-foreground">{card.subText}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  return null;
}
