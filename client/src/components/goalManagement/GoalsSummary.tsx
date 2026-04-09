import {
  IconAlertCircle,
  IconCircleCheck,
  IconProgress,
  IconTarget,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GoalsSummaryProps = {
  notStartedGoals: number;
  completedGoals: number;
  atRiskGoals: number;
  onTrackGoals: number;
  incompleteGoals: number;
};

function GoalsSummary({
  notStartedGoals,
  completedGoals,
  atRiskGoals,
  onTrackGoals,
  incompleteGoals,
}: GoalsSummaryProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardDescription>On Track Goals</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {onTrackGoals}
              </CardTitle>
              <IconTarget className="text-primary" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>At Risk</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {atRiskGoals}
              </CardTitle>
              <IconProgress className="text-emerald-500" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Incomplete Goals</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {incompleteGoals}
              </CardTitle>
              <IconAlertCircle className="text-destructive" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed Goals</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {completedGoals}
              </CardTitle>
              <IconCircleCheck className="text-sky-500" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Not Started Goals</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {notStartedGoals}
              </CardTitle>
              <IconProgress className="text-amber-500" />
            </div>
          </CardHeader>
        </Card>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          * summary is based on goals with due date in the current quarter and
          year.
        </p>
      </div>
    </>
  );
}

export default GoalsSummary;
