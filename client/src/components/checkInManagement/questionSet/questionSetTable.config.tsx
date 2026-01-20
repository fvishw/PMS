import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { QuestionTableAction } from "./questionTableAction";

export type QuestionTableColumn = {
  version: string;
  createdAt: string;
  isActive: boolean;
  designation: string;
  role: string;
};

export const columns: ColumnDef<QuestionTableColumn>[] = [
  {
    accessorKey: "version",
    header: () => <div className="text-center">Version</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("version")}</div>
    ),
  },
  {
    accessorKey: "designation",
    header: () => <div className="text-center">Designation</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.original.designation?.title}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.original.designation?.role}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      const formattedDate = dayjs(row.getValue("createdAt")).format("D MMM YY");

      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("isActive") ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="outline">Inactive</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <QuestionTableAction
        version={row.getValue("version")}
        designationId={row.original.designation?._id}
        isActive={row.getValue("isActive")}
      />
    ),
  },
];
