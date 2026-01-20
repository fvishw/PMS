import { type ColumnDef } from "@tanstack/react-table";
import { PerformanceTableAction } from "./performanceTable.action";
import dayjs from "dayjs";

export type KPITableColumn = {
  _id: string;
  designation: string;
  createdBy: string;
  createdAt: Date | string;
};

export const columns: ColumnDef<KPITableColumn>[] = [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "designation",
    header: () => <div className="text-center">Designation</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("designation")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: () => <div className="text-center ">Created By</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center whitespace-normal break-after-all">
        {row.getValue("createdBy")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      const formattedDate = dayjs(row.getValue("createdAt")).format("D MMM YY");
      return <div className="font-medium text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">
        <PerformanceTableAction performanceId={row.original._id} />
      </div>
    ),
  },
];
