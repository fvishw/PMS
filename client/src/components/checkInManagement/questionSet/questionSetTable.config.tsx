import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { QuestionTableAction } from "./questionTableAction";

export type QuestionTableColumn = {
  version: string;
  srNo: string;
  createdAt: string;
  isActive: boolean;
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
      <QuestionTableAction version={row.getValue("version")} />
    ),
  },
];
