import { useQuery } from "@tanstack/react-query";
import { CustomDataTable } from "../customTable";
import GoalFormDialog from "./GoalModal/GoalFormDialog";
import { columns, GoalRow } from "./goalTable.config";
import Api from "@/api/api";
import { Goal } from "@/types/goal";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "../ui/button";

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
    const formattedDueDate = rawDueDate ? dayjs(rawDueDate).format("MMM DD, YYYY") : "-";
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
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => Api.getAdminGoals(),
  });

  const goals: GoalRow[] = data ? getTransformedGoals(data?.goals) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <GoalFormDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <Button onClick={() => setIsOpen(!isOpen)}>Create goal</Button>
      </div>

      {/* <GoalsSummary {...summary} /> */}

      <CustomDataTable data={goals} columns={columns} />
    </div>
  );
};
