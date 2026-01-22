import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckInTableAction } from "./checkInTableAction";
export type CheckInQuestionTableColumn = {
  _id: string;
  user: string;
  version: string;
  createdAt: string | Date;
  email: string;
  name: string;
};

export const columns: ColumnDef<CheckInQuestionTableColumn>[] = [
  {
    id: "srNo",
    header: () => <div className="text-center">Sr. No.</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Employee Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "version",
    header: () => <div className="text-center">Version</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">v.{row.getValue("version")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      const raw: Date | string = row.getValue("createdAt");
      const formattedDate = raw ? dayjs(raw).format("D MMM YY") : "-";
      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <CheckInTableAction checkInId={row.original._id} />,
  },
];
