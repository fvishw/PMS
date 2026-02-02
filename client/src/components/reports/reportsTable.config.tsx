import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import ReportsTableAction from "./reportsTableAction";

export type ReportTableColumn = {
  _id: string;
  quarter: string;
  year: number;
  overAllScore: number;
};

export const columns: ColumnDef<ReportTableColumn>[] = [
  {
    accessorKey: "srNo",
    header: () => <div className="text-center">Sr No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "quarter",
    header: () => <div className="text-center">Quarter</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.original.quarter}</div>
    ),
  },
  {
    accessorKey: "year",
    header: () => <div className="text-center">Year</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.original.year}</div>
    ),
  },
  {
    accessorKey: "overallScore",
    header: () => <div className="text-center">Overall Score</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className="px-3 py-1 rounded-md bg-green-100 text-green-800">
          {row.original.overAllScore}%
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ReportsTableAction reportId={row.original._id} />,
  },
];
