import dayjs from "dayjs";
import { GoalRow } from "./goalTable.config";
import { Goal } from "@/types/goal";

export const getTransformedGoals = (data: Goal[]): GoalRow[] => {
  const transformedGoals: GoalRow[] = data.map((goal: Goal) => {
    const totalSubTasks = goal.subTasks.length;
    const totalCompletedSubTasks = goal.subTasks.filter(
      (subTask: Goal["subTasks"][0]) => subTask.isCompleted,
    ).length;
    const completedPercentage =
      totalSubTasks === 0
        ? 0
        : Math.round((totalCompletedSubTasks / totalSubTasks) * 100);

    const rawDueDate: Date | string = goal.dueDate;
    const formattedDueDate = rawDueDate
      ? dayjs(rawDueDate).format("MMM DD, YYYY")
      : "-";
    const owner =
      typeof goal.owner === "string"
        ? goal.owner
        : goal.owner?.fullName || "Unknown";
    const rawCreatedAt: Date | string | undefined = goal.createdAt;
    const rawUpdatedAt: Date | string | undefined = goal.updatedAt;
    const formattedCreatedAt = rawCreatedAt
      ? dayjs(rawCreatedAt).format("MMM DD, YYYY")
      : "-";
    const formattedUpdatedAt = rawUpdatedAt
      ? dayjs(rawUpdatedAt).format("MMM DD, YYYY")
      : "-";
    return {
      ...goal,
      owner,
      subTasks: goal.subTasks,
      progress: completedPercentage,
      dueDate: formattedDueDate,
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
      status: goal.status ?? "on_track",
    };
  });
  return transformedGoals;
};
