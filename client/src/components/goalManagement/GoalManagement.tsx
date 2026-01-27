import { useQuery } from "@tanstack/react-query";
import { CustomDataTable } from "../customTable";
import GoalFormDialog from "./GoalModal/GoalFormDialog";
import { columns, GoalRow } from "./goalTable.config";
import Api from "@/api/api";
import { Goal } from "@/types/goal";
import dayjs from "dayjs";
import { useState } from "react";
import GoalsSummary from "./GoalsSummary";
import { useAuth } from "@/hooks/useAuthContext";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";

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
    return {
      ...goal,
      owner,
      subTasks: goal.subTasks,
      progress: completedPercentage,
      dueDate: formattedDueDate,
      status: goal.status ?? "on_track",
    };
  });
  return transformedGoals;
};

export const GoalManagement = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data,
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => Api.getAdminGoals(),
  });

  const {
    data: cardSummary,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["sectionCard", user?._id],
    queryFn: () => Api.getGoalCardStatus(),
  });
  let contentToDisplay;

  const goals: GoalRow[] = data ? getTransformedGoals(data?.goals) : [];

  if (goalsLoading || statsLoading) {
    return (
      <div className="w-full  rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (goalsError || statsError) {
    return (
      <ApiErrorMessage message={goalsError?.message || statsError?.message} />
    );
  }
  if (data) {
    const stats = cardSummary?.stats;
    const summary = {
      totalGoals: stats?.totalGoals ?? 0,
      completedGoals: stats?.completedGoals ?? 0,
      onTrackGoals: (stats?.totalGoals ?? 0) - (stats?.completedGoals ?? 0),
    };

    contentToDisplay = (
      <div className="space-y-6">
        <GoalsSummary
          totalGoals={summary.totalGoals}
          onTrackGoals={summary.onTrackGoals}
          completedGoals={summary.completedGoals}
        />
        <CustomDataTable columns={columns} data={goals} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <GoalFormDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
      {contentToDisplay}
    </div>
  );
};
