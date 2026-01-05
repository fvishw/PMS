import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  IconChecklist,
  IconClockHour4,
  IconTargetArrow,
  IconUser,
} from "@tabler/icons-react";

const reviewGoalsCard = [
  {
    title: "Total Users",
    value: 12,
    description: "Active employees this cycle",
    footer: "Total employees in the system",
    icon: <IconUser className="stroke-primary" />,
  },
  {
    title: "Active KPIs",
    value: 11,
    description: "KPIs updated this month",
    footer: "Total active KPIs assigned",
    icon: <IconChecklist className="stroke-primary" />,
  },
  {
    title: "Pending Reviews",
    value: 4,
    description: "Awaiting manager approval",
    footer: "Pending reviews in current cycle",
    icon: <IconClockHour4 className="stroke-primary" />,
  },
  {
    title: "Completed Reviews",
    value: 8,
    description: "On track for current cycle",
    footer: "Completed employee reviews",
    icon: <IconUser className="stroke-primary" />,
  },
  {
    title: "Goals Set",
    value: 20,
    description: "Goals established this cycle",
    footer: "Total goals set by employees",
    icon: <IconTargetArrow className="stroke-primary" />,
  },
  {
    title: "Goals Achieved",
    value: 15,
    description: "Goals successfully met",
    footer: "Total goals achieved by employees",
    icon: <IconTargetArrow className="stroke-primary" />,
  },
];

export const ReviewAppraisalCard = () => {
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
};
