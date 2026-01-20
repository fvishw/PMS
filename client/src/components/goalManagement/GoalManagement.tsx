import { useQuery } from "@tanstack/react-query";
import { CustomDataTable } from "../customTable";
import GoalFormDialog from "./GoalModal/GoalFormDialog";
import { columns, GoalRow } from "./goalTable.config";
import Api from "@/api/api";
import { Goal } from "@/types/goal";
import dayjs from "dayjs";

//   {
//     id: "goal-1",
//     title: "Increase customer retention to 92%",
//     owner: "Ava Thompson",
//     dueDate: "Dec 20, 2024",
//     progress: 72,
//     status: "on_track",
//   },
//   {
//     id: "goal-2",
//     title: "Launch performance feedback hub",
//     owner: "Liam Parker",
//     dueDate: "Nov 08, 2024",
//     progress: 54,
//     status: "at_risk",
//   },
//   {
//     id: "goal-3",
//     title: "Reduce onboarding time to 3 weeks",
//     owner: "Sophia Lee",
//     dueDate: "Oct 01, 2024",
//     progress: 90,
//     status: "on_track",
//   },
//   {
//     id: "goal-4",
//     title: "Publish manager enablement playbook",
//     owner: "Noah Garcia",
//     dueDate: "Sep 05, 2024",
//     progress: 100,
//     status: "completed",
//   },
// ];

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
    const formattedDueDate = dayjs(goal.dueDate).format("MMM DD, YYYY");
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
  const { data } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => Api.getAdminGoals(),
  });

  const goals: GoalRow[] = data ? getTransformedGoals(data?.goals) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <GoalFormDialog />
      </div>

      {/* <GoalsSummary {...summary} /> */}

      <CustomDataTable data={goals} columns={columns} />
    </div>
  );
};
