import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ReviewTableAction } from "./reviewTableAction";

export type ReviewTableColumn = {
  fullName: string;
  stage: string;
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
      return <div className="text-center">{row.getValue("fullName")}</div>;
    },
  },
  {
    accessorKey: "stage",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("stage") as string;
      return (
        <div className="text-center">
          <Badge variant="default">{status || "Unknown"}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ReviewTableAction />,
  },
];

export const data = [
  {
    fullName: "John Doe",
    stage: "In Progress",
  },
  {
    fullName: "Jane Smith",
    stage: "Completed",
  },
  {
    fullName: "Alice Johnson",
    stage: "Pending",
  },
];
