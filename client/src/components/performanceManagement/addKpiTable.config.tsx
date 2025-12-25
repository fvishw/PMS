import { Controller, Control } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import { IconTrash } from "@tabler/icons-react";

type KpiFormRow = {
  objective: string;
  indicator: string;
  weight: number | "";
  accessorFn?: () => any;
};

type KpiForm = {
  kpis: KpiFormRow[];
};

interface IColumnsProps {
  control: Control<PerformanceFormValue>;
  remove: (index: number) => void;
}
type Indicator = string;
type Competency = {
  title: string;
  indicators: Indicator[];
};
interface PerformanceFormValue {
  kpis: KpiFormRow[];
  designationId: string;
  competencies: Competency[];
}

export const getColumns = (
  control: Control<PerformanceFormValue>,
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
        name={`kpis.${row.index}.indicator` as const}
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
      <span>
        <IconTrash
          className="text-red-600 cursor-pointer hover:text-red-700 h-5"
          onClick={() => remove(row.index)}
        />
      </span>
    ),
  },
];

export { KpiFormRow, IColumnsProps, KpiForm, PerformanceFormValue };
