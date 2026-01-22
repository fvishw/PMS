import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ReviewTableAction } from "./reviewTableAction";

export type ReviewTableColumn = {
  user: {
    fullName: string;
    role: string;
  };
  stage: string;
  designation: {
    title: string;
  };
};

export const columns: ColumnDef<ReviewTableColumn>[] = [
  {
    accessorKey: "srNo",
    header: () => <div className="text-center">Sr No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.user?.fullName || "Unknown"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center capitalize">
          {row.original.user?.role || "Unknown"}
        </div>
      );
    },
  },
  {
    accessorKey: "designation",
    header: () => <div className="text-center">Designation</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.designation?.title || "Unknown"}
        </div>
      );
    },
  },
  {
    accessorKey: "stage",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("stage") as string;
      const mappedStatus = stageMapper[status];
      return (
        <div className="text-center">
          <Badge variant="default">{mappedStatus || "Unknown"}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ReviewTableAction row={row} />,
  },
];

const stageMapper: Record<string, string> = {
  kpi_acceptance: "KPI Acceptance",
  self_review: "Self Review",
  manager_review: "Manager Review",
  admin_review: "Admin Review",
  user_final_review: "Final Review",
  completed: "Completed",
};
