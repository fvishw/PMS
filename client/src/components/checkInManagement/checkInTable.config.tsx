import { type ColumnDef } from "@tanstack/react-table";

export type CheckInQuestionTableColumn = {
  srNo: string;
  version: string;
  createdBy: string;
  createdAt: Date | string;
};

export const columns: ColumnDef<CheckInQuestionTableColumn>[] = [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => <div className="capitalize text-center">{row.id}</div>,
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
    header: () => <div className="text-center ">Created By</div>,
    cell: ({ row }) => (
      <div className="lowercase  text-center whitespace-normal break-after-all">
        {row.getValue("createdBy")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("createdAt")}</div>
    ),
  },
];

export const data: CheckInQuestionTableColumn[] = [
  {
    srNo: "1",
    version: "1",
    createdBy: "John Doe",
    createdAt: "2024-01-01",
  },
  {
    srNo: "2",
    version: "2",
    createdBy: "Jane Smith",
    createdAt: "2024-01-02",
  },
];
