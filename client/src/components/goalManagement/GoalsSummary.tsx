import { IconCircleCheck, IconProgress, IconTarget } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GoalsSummaryProps = {
  total: number;
  onTrack: number;
  atRisk: number;
  completed: number;
};

function GoalsSummary({ total, onTrack, atRisk, completed }: GoalsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total goals</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">{total}</CardTitle>
            <IconTarget className="text-primary" />
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>On track</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">{onTrack}</CardTitle>
            <IconProgress className="text-emerald-500" />
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>At risk</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">{atRisk}</CardTitle>
            <IconProgress className="text-amber-500" />
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">{completed}</CardTitle>
            <IconCircleCheck className="text-sky-500" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default GoalsSummary;
