import { Controller, Control } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

type KpiFormRow = {
  objective: string;
  indicators: string;
  weight: number | "";
  accessorFn?: () => any;
};

type KpiForm = {
  kpis: KpiFormRow[];
};

interface IColumnsProps {
  control: Control<PerformanceValue>;
  remove: (index: number) => void;
}
type Indicator = string;
type Competency = {
  title: string;
  indicators: Indicator[];
};
interface PerformanceValue {
  kpis: KpiFormRow[];
  designationId: string;
  competencies: Competency[];
}

export const getColumns = (
  control: Control<PerformanceValue>,
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
        name={`kpis.${row.index}.objective` as const}
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

export { KpiFormRow, IColumnsProps, KpiForm, PerformanceValue };
