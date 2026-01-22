import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

type Designation = {
  title: string;
};
type Reviewer = {
  fullName: string;
};

export type UserTableColumn = {
  fullName: string;
  email: string;
  createdAt: string | Date;
  role: string;
  designation: Designation;
  parentReviewer: Reviewer;
};

export const columns: ColumnDef<UserTableColumn>[] = [
  {
    accessorKey: "fullName",
    header: () => <div className="text-center">Full Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("fullName")}</div>
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
    accessorKey: "designation",
    header: () => <div className="text-center">Designation</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.designation.title}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
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
];
