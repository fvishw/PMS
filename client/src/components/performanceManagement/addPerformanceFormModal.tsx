import Api from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";

import {
  getColumns,
  KpiFormRow,
  PerformanceFormValue,
} from "./addKpiTable.config";
import { useFieldArray, useForm } from "react-hook-form";
import { CustomDataTable } from "../customTable";
import CompetencyItem from "./copetencyItem";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import DesignationSelection from "./designationSelection";
import { useMutation } from "@tanstack/react-query";

export function AddPerformanceFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { control, handleSubmit } = useForm<PerformanceFormValue>({
    defaultValues: {
      kpis: [{ objective: "", indicator: "", weight: 0 }],
      designationId: "",
      competencies: [
        {
          title: "",
          indicators: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "kpis",
  });
  const {
    fields: competencyFields,
    append: appendCompetency,
    remove: removeCompetency,
  } = useFieldArray({
    control,
    name: "competencies",
  });

  const { mutate: addPerformanceRecord } = useMutation({
    mutationFn: (data: PerformanceFormValue) => Api.addPerformanceRecord(data),
    onSuccess: () => {
      toast.success("Performance Record Added Successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["performanceList"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add Performance Record", {
        position: "top-right",
      });
    },
  });

  const columns: ColumnDef<KpiFormRow>[] = getColumns(control, remove);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <form
          onSubmit={handleSubmit((data) => addPerformanceRecord(data))}
          className="max-h-[80vh]"
        >
          <DialogHeader>
            <DialogTitle>Create Performance Record</DialogTitle>
            <DialogDescription>
              Fill the form below to add a new Performance record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid space-y-4">
            <div className="grid gap-3">
              <Label>Designation</Label>
              <DesignationSelection control={control} />
            </div>

            <h1 className="font-bold text-lg dark:text-white text-black">
              Key Performance Indicators
            </h1>
            <div className="ml-auto">
              <Button
                type="button"
                onClick={() =>
                  append({ objective: "", indicator: "", weight: "" })
                }
              >
                Add Row
              </Button>
            </div>
            <CustomDataTable columns={columns} data={fields} />
          </div>

          {/* competencies */}
          <div className="space-y-4 ">
            <div className="flex items-center gap-1">
              <h1 className="font-bold text-lg dark:text-white text-black ">
                Competencies
              </h1>
              <span className="text-gray-400 font-normal text-sm">(max 4)</span>
            </div>

            <Button
              type="button"
              className="ml-auto block"
              disabled={competencyFields.length >= 4}
              onClick={() => {
                if (competencyFields.length < 4) {
                  appendCompetency({ title: "", indicators: [""] });
                }
              }}
            >
              Add Competency
            </Button>

            {competencyFields.map((field, index) => (
              <CompetencyItem
                key={field.id}
                control={control}
                index={index}
                removeCompetency={removeCompetency}
              />
            ))}
          </div>
          <DialogFooter className=" p-4">
            <Button type="submit">Create Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
