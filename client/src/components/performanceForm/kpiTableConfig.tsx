import { type ColumnDef } from "@tanstack/react-table";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { EditPermissions } from "@/types/performance";

export type KPI = {
  _id: string;
  objective: string;
  indicator: string;
  weight: number;
  selfScore?: number;
  managerScore?: number;
  selfComments?: string;
  managerComments?: string;
};

const getColumns = (
  permissions: EditPermissions,
  register: any
): ColumnDef<KPI>[] => [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.id}
        <Input
          type="hidden"
          value={row.original._id}
          {...register(`criteria.${row.id}._id`)}
        />
      </div>
    ),
  },
  {
    accessorKey: "objective",
    header: () => <div className="text-center">Objective</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("objective")}</div>
    ),
  },
  {
    accessorKey: "indicator",
    header: () => <div className="text-center ">Indicator</div>,
    cell: ({ row }) => (
      <div className="lowercase w-[200px] text-center whitespace-normal break-after-all">
        {row.getValue("indicator")}
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
            type="number"
            min={0}
            max={row.original.weight}
            defaultValue={row.original.selfScore || ""}
            step={1}
            className="w-18 text-center"
            disabled={!permissions.canEditSelf}
            {...register(`criteria.${row.id}.selfScore`)}
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
            value={row.original.selfComments || ""}
            disabled={!permissions.canEditSelf}
            {...register(`criteria.${row.id}.selfComments`)}
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
            type="number"
            min={0}
            max={row.original.weight}
            className="w-18 text-center"
            defaultValue={row.original.managerScore || ""}
            disabled={!permissions.canEditManager}
            {...register(`criteria.${row.id}.managerScore`)}
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
            disabled={!permissions.canEditManager}
            defaultValue={row.original.managerComments || ""}
            {...register(`criteria.${row.id}.managerComments`)}
          />
        </span>
      );
    },
  },
];

export { getColumns };
