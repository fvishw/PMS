import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { UserTableAction } from "./userTable.action";
import { IUser } from "@/types/user";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<IUser>[] = [
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
      <div className="text-center">{row.original.designation?.title || "-"}</div>
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
    accessorKey: "phoneNumber",
    header: () => <div className="text-center">Phone Number</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.phoneNumber || "-"}</div>
    ),
  },
  {
    accessorKey: "joiningDate",
    header: () => <div className="text-center">Joining Date</div>,
    cell: ({ row }) => {
      const raw = row.original.joiningDate;
      const formattedDate = raw ? dayjs(raw).format("D MMM YY") : "-";
      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive !== false;

      return (
        <div className="text-center">
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
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
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <UserTableAction user={row.original} />,
  },
];
