import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import { MeetingTableAction } from "./meetingTableAction";
import { IBadgeVariant } from "@/types/badge";

export type MeetingRow = {
  _id: string;
  title: string;
  employeeName: string;
  meetingDate: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
};

const statusStyles: Record<string, string> = {
  Scheduled: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};

const statusMapping: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const columns: ColumnDef<MeetingRow>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Title</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "employeeName",
    header: () => <div className="text-center">Employee</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("employeeName")}
      </div>
    ),
  },
  {
    accessorKey: "meetingDate",
    header: () => <div className="text-center">Meeting Date</div>,
    cell: ({ row }) => {
      const raw: Date | string = row.getValue("meetingDate");
      const formattedDate = raw ? dayjs(raw).format("D MMM YY") : "-";
      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const currentStatus = statusMapping[status];
      const statusStyle = statusStyles[currentStatus];
      return (
        <div className="text-center">
          <Badge variant={statusStyle as IBadgeVariant["variant"]}>
            {currentStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">
        <MeetingTableAction meeting={row.original} />
      </div>
    ),
  },
];
