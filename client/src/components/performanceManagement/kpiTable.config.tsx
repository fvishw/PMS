import { type ColumnDef } from "@tanstack/react-table";

export type KPITableColumn = {
  srNo: string;
  designation: string;
  createdBy: string;
  createdAt: Date | string;
};

export const columns: ColumnDef<KPITableColumn>[] = [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => <div className="capitalize text-center">{row.id}</div>,
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

export const data: KPITableColumn[] = [
  {
    srNo: "1",
    designation: "Software Developer",
    createdBy: "John Doe",
    createdAt: "2024-01-01",
  },
  {
    srNo: "2",
    designation: "Product Manager",
    createdBy: "Jane Smith",
    createdAt: "2024-01-02",
  },
];
