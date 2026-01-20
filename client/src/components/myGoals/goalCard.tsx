import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { IGoal } from "./myGoals";
import { SubTask } from "@/types/goal";

interface GoalCardProps {
  goal: IGoal;
  onOpen: (goalId: string) => void;
}

export const GoalCard = ({ goal, onOpen }: GoalCardProps) => {
  return (
    <Card data-slot="card">
      <CardHeader>
        <CardTitle className="leading-5">{goal.title}</CardTitle>
        <CardAction>
          <Button
            onClick={() => onOpen(goal._id)}
            variant={"ghost"}
            className="text-sm"
          >
            View More
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside">
          {goal.subTasks.map((subTask: SubTask, index:number) => (
            <li
              key={index}
              className="text-sm text-muted-foreground w-full text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {subTask.title}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm font-medium">Progress: {goal.progress}%</span>
        <span className="text-sm text-muted-foreground">{goal.dueDate}</span>
      </CardFooter>
    </Card>
  );
};
