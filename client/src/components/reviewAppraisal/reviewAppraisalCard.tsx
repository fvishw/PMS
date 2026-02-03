import Api from "@/api/api";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconChecklist, IconClockHour4, IconUser } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuthContext";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";

export const ReviewAppraisalCard = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviewCardStatus", user?._id],
    queryFn: () => Api.getReviewCardStatus(),
  });

  if (isLoading) {
    return (
      <div className="w-full  rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  if (data) {
    const stats = data.stats ?? {};
    const totalCompletedReview = stats.totalCompletedReview ?? 0;
    const totalPendingReview = stats.totalPendingReview ?? 0;
    const totalMasterPerformanceTemplate =
      stats.totalMasterPerformanceTemplate ?? 0;

    const reviewGoalsCard = [
      {
        title: "Total Performance Templates",
        value: totalMasterPerformanceTemplate,
        description: "Active templates in system",
        footer: "Total templates created",
        icon: <IconChecklist className="stroke-primary" />,
      },
      {
        title: "Pending Reviews",
        value: totalPendingReview,
        description: "Awaiting manager approval",
        footer: "Pending reviews in current cycle",
        icon: <IconClockHour4 className="stroke-primary" />,
      },
      {
        title: "Completed Reviews",
        value: totalCompletedReview,
        description: "On track for current cycle",
        footer: "Completed employee reviews",
        icon: <IconUser className="stroke-primary" />,
      },
    ];

    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {reviewGoalsCard.map((card, index) => (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>{card.icon}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.description}
              </div>
              <div className="text-muted-foreground">{card.footer}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return null;
};
