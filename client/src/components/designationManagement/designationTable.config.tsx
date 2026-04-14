import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Designation } from "@/types/user";
import { DesignationTableAction } from "./designationTable.action";

export const columns: ColumnDef<Designation>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Designation</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.original.role}</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive !== false;

      return (
        <div className="text-center">
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.createdAt
          ? dayjs(row.original.createdAt).format("D MMM YY")
          : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <DesignationTableAction designation={row.original} />,
  },
];
