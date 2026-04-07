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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function AddPerformanceFormModal({
  isOpen,
  onClose,
  mode = "add",
  performanceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  performanceId?: string;
}) {
  const isEditMode = mode === "edit";

  const { control, handleSubmit, reset } = useForm<PerformanceFormValue>({
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

  const { data: existingTemplate } = useQuery({
    queryKey: ["performanceDetails", performanceId],
    queryFn: () => Api.fetchMasterPerformanceById(performanceId as string),
    enabled: isEditMode && !!performanceId && isOpen,
  });

  useEffect(() => {
    if (!isEditMode || !existingTemplate?.performanceTemplate) {
      return;
    }

    const template = existingTemplate.performanceTemplate;
    const designationId =
      typeof template.designation === "string"
        ? template.designation
        : template.designation?._id || "";

    reset({
      designationId,
      kpis: (template.kpis || []).map((kpi) => ({
        objective: kpi.objective,
        indicator: kpi.indicator,
        weight: kpi.weight,
      })),
      competencies: (template.competencies || []).map((competency) => ({
        title: competency.title,
        indicators: competency.indicators || [],
      })),
    });
  }, [isEditMode, existingTemplate?.performanceTemplate, reset]);

  const { mutate: savePerformanceRecord, isPending } = useMutation({
    mutationFn: (data: PerformanceFormValue) => {
      if (isEditMode && performanceId) {
        return Api.updatePerformanceRecord(performanceId, data);
      }

      return Api.addPerformanceRecord(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Performance Record Updated Successfully"
          : "Performance Record Added Successfully",
        {
          position: "top-right",
        },
      );
      queryClient.invalidateQueries({ queryKey: ["performanceList"] });
      if (performanceId) {
        queryClient.invalidateQueries({
          queryKey: ["performanceDetails", performanceId],
        });
      }
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          (isEditMode
            ? "Failed to update Performance Record"
            : "Failed to add Performance Record"),
        {
          position: "top-right",
        },
      );
    },
  });

  const columns: ColumnDef<KpiFormRow>[] = getColumns(control, remove);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto overflow-x-hidden sidebar-scroll">
        <form
          onSubmit={handleSubmit((data) => savePerformanceRecord(data))}
          className="max-h-[80vh]"
        >
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Edit Performance Record"
                : "Create Performance Record"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the template details below."
                : "Fill the form below to add a new Performance record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid space-y-4">
            <div className="grid gap-3">
              <Label>Designation</Label>
              <DesignationSelection control={control} disabled={isEditMode} />
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
            <Button type="submit" disabled={isPending}>
              {isEditMode ? "Update Record" : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
