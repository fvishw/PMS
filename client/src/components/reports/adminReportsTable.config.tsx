import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import ReportsTableAction from "./reportsTableAction";

export type AdminReportTableColumn = {
  _id: string;
  quarter: string;
  year: number;
  createdAt: string;
  overAllScore: number;
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: "admin" | "manager" | "employee";
  };
};

export const adminReportsColumns: ColumnDef<AdminReportTableColumn>[] = [
  {
    accessorKey: "srNo",
    header: () => <div className="text-center">Sr No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "employee",
    header: () => <div className="text-center">Employee</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.user?.fullName || "-"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => (
      <div className="text-center break-all">
        {row.original.user?.email || "-"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="capitalize">
          {row.original.user?.role || "-"}
        </Badge>
      </div>
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
    cell: ({ row }) => <div className="text-center">{row.original.year}</div>,
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
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.createdAt
          ? dayjs(row.original.createdAt).format("D MMM YY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ReportsTableAction reportId={row.original._id} />,
  },
];
