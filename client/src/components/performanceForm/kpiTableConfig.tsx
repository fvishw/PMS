import { type ColumnDef } from "@tanstack/react-table";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export type KPI = {
  srNo: string;
  name: string;
  description: string;
  weight: number;
  selfScore?: number;
  managerScore?: number;
  selfComments?: string;
  managerComments?: string;
};

export const columns: ColumnDef<KPI>[] = [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => <div className="capitalize text-center">{row.id}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Objective</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center ">Indicator</div>,
    cell: ({ row }) => (
      <div className="lowercase w-[200px] text-center whitespace-normal break-after-all">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-center">Weight</div>,
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("weight")}</div>
    ),
  },
  {
    id: "selfScore",
    header: () => <div className="text-center">Self Score</div>,
    cell: ({ row }) => {
      return (
        <span>
          <Input
            className="w-13 text-center"
            defaultValue={row.getValue("selfScore") || ""}
          />
        </span>
      );
    },
  },
  {
    id: "selfComments",
    header: () => <div className="text-center">Self Comments</div>,
    cell: ({ row }) => {
      return (
        <span className="text-center">
          <Textarea
            className="h-5 w-[200px]"
            rows={1}
            defaultValue={row.getValue("selfComments") || ""}
          />
        </span>
      );
    },
  },
  {
    id: "managerScore",
    header: () => <div className="text-center">Manager Score</div>,
    cell: ({ row }) => {
      return (
        <span className="text-center">
          <Input
            className="w-13"
            defaultValue={row.getValue("managerScore") || ""}
          />
        </span>
      );
    },
  },
  {
    id: "managerComments",
    header: () => <div className="text-center">Manager Comments</div>,
    cell: ({ row }) => {
      return (
        <span className="text-center">
          <Textarea
            className="h-5 w-[200px]"
            rows={1}
            defaultValue={row.getValue("selfComments") || ""}
          />
        </span>
      );
    },
  },
];

export const data: KPI[] = [
  {
    srNo: "1",
    name: "Timely Delivery of Assigned Tasks",
    description:
      "% of tasks delivered on or before deadline (based on sprint/project schedule)",
    weight: 20,
    selfScore: 0,
    managerScore: 0,
    selfComments: "",
    managerComments: "",
  },
  {
    srNo: "2",
    name: "Improve customer satisfaction",
    description: "Customer feedback surveys",
    weight: 15,
  },
];
