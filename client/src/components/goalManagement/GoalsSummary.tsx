import { IconCircleCheck, IconProgress, IconTarget } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GoalsSummaryProps = {
  totalGoals: number;
  onTrackGoals: number;
  completedGoals: number;
};

function GoalsSummary({
  totalGoals,
  onTrackGoals,
  completedGoals,
}: GoalsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Total goals</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">
              {totalGoals}
            </CardTitle>
            <IconTarget className="text-primary" />
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>On track</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">
              {onTrackGoals}
            </CardTitle>
            <IconProgress className="text-emerald-500" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">
              {completedGoals}
            </CardTitle>
            <IconCircleCheck className="text-sky-500" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default GoalsSummary;
