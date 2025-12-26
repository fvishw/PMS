import { IconEye } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export type QuestionTableColumn = {
  version: string;
  srNo: string;
  createdAt: string;
  createdBy: string;
};

export const columns: ColumnDef<QuestionTableColumn>[] = [
  {
    accessorKey: "srNo",
    header: () => <div className="text-center">Sr. No.</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.index + 1}</div>
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
    accessorKey: "createdBy",
    header: () => <div className="text-center">Created By</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("createdBy")}</div>
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
        <IconEye />
      </div>
    ),
  },
];
