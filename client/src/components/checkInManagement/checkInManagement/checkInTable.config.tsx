import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { UserPastCheckInModal } from "./userPastCheckInModal";
export type CheckInQuestionTableColumn = {
  _id: string;
  user: string;
  srNo: string;
  version: string;
  createdAt: string;
  email: string;
  name: string;
};

export const columns: ColumnDef<CheckInQuestionTableColumn>[] = [
  {
    accessorKey: "srNo",
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
      const formattedDate = dayjs(row.getValue("createdAt")).format("D MMM YY");

      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center space-x-2 text-gray-300 hover:text-gray-400 cursor-pointer transition duration-150">
        <UserPastCheckInModal checkInId={row.original._id} />
      </div>
    ),
  },
];
