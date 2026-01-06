import { type ColumnDef } from "@tanstack/react-table";

export type CheckInTableColumn = {
  srNo: string;
  fullName: string;
  checkInDate: Date | string;
  version: number;
  action: string;
};

export const columns: ColumnDef<CheckInTableColumn>[] = [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: () => <div className="text-center">Employee Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center ">Check-In Date</div>,
    cell: ({ row }) => (
      <div className="lowercase  text-center whitespace-normal break-after-all">
        {row.getValue("createdAt")}
      </div>
    ),
  },
];

export const data: CheckInTableColumn[] = [
  {
    srNo: "1",
    fullName: "John Doe",
    checkInDate: "2024-01-01",
    version: 1,
    action: "View",
  },
];
