import { Controller, Control } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeOptions } from "@/types/option";
import { Textarea } from "../../ui/textarea";

type QuestionRow = {
  question: string;
  type: string;
  accessorFn?: () => any;
};

type QuestionForm = {
  questions: QuestionRow[];
};

type QuestionFormPayload = {
  designationId: string;
  questions: QuestionRow[];
  version: string;
};

interface IColumnsProps {
  control: Control<QuestionForm>;
  remove: (index: number) => void;
}

export const getColumns = (
  control: Control<QuestionFormPayload>,
  remove: (index: number) => void
): ColumnDef<QuestionRow>[] => [
  {
    id: "sr.no",
    header: () => <div className="text-center">Sr.No</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    header: "Question",
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`questions.${row.index}.question`}
        render={({ field }) => <Textarea className="w-[250px]" {...field} />}
      />
    ),
  },

  {
    header: "Type",
    cell: ({ row }) => (
      // need dropdown
      <Controller
        control={control}
        name={`questions.${row.index}.type`}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TypeOptions.map((role) => (
                  <SelectItem key={role.label} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
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

export { QuestionFormPayload, IColumnsProps, QuestionForm, QuestionRow };
