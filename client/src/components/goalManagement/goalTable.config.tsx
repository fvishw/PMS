import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { GoalTableAction } from "./goalTableAction";
import { IBadgeVariant } from "@/types/badge";
import { SubTask } from "@/types/goal";

export type GoalRow = {
  _id: string;
  title: string;
  owner: string;
  dueDate: string;
  progress: number;
  status: "on_track" | "at_risk" | "completed";
  subTasks: SubTask[];
};

const statusStyles: Record<string, string> = {
  "On Track": "secondary",
  "At Risk": "destructive",
  Completed: "default",
};

const statusMapping: Record<string, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  completed: "Completed",
};

export const columns: ColumnDef<GoalRow>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Goal</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-center">Owner</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("owner")}</div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: () => <div className="text-center">Due Date</div>,
    cell: ({ row }) => {
      const transformDate = dayjs(row.getValue("dueDate")).format(
        "MMM DD, YYYY",
      );
      return <div className="text-center">{transformDate}</div>;
    },
  },
  {
    accessorKey: "progress",
    header: () => <div className="text-center">Progress</div>,
    cell: ({ row }) => (
      <Progress className="h-[6px]" value={row.getValue("progress")} />
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const currentStatus = statusMapping[status];
      const statusStyle = statusStyles[currentStatus];
      return (
        <div className="text-center">
          <Badge variant={statusStyle as IBadgeVariant["variant"]}>
            {currentStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">
        <GoalTableAction goalId={row.original._id} />
      </div>
    ),
  },
];
