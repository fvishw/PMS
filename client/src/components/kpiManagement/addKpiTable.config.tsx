import { Controller, Control } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

type KpiFormRow = {
  objective: string;
  indicators: string;
  weight: number | "";
};

type KpiForm = {
  kpis: KpiFormRow[];
};

export interface IColumnsProps {
  control: Control<KpiForm>;
  remove: (index: number) => void;
}

export const getColumns = (
  control: Control<KpiForm>,
  remove: (index: number) => void
): ColumnDef<KpiFormRow>[] => [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    header: "Objective",
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`kpis.${row.index}.objective`}
        render={({ field }) => <Input {...field} />}
      />
    ),
  },
  {
    header: "Indicators",
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`kpis.${row.index}.indicators`}
        render={({ field }) => <Textarea {...field} />}
      />
    ),
  },
  {
    header: "Weight",
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`kpis.${row.index}.weight`}
        render={({ field }) => <Input type="number" {...field} />}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        className="text-red-600"
        onClick={() => remove(row.index)}
      >
        Delete
      </Button>
    ),
  },
];
