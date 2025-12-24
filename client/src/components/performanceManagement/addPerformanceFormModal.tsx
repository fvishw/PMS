import Api from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { IDesignationOption } from "@/types/user";
import { Spinner } from "../ui/spinner";
import { getColumns, KpiFormRow, PerformanceValue } from "./addKpiTable.config";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { CustomDataTable } from "../customTable";
import CompetencyItem from "./copetencyItem";

export function AddKpiFormModal() {
  const { control, handleSubmit } = useForm<PerformanceValue>({
    defaultValues: {
      kpis: [{ objective: "", indicators: "", weight: "" }],
      designationId: "",
      competencies: [
        {
          title: "",
          indicators: [""],
        },
      ],
    },
  });
  const { data: designationsData, isPending: designationLoader } = useQuery({
    queryKey: ["designations"],
    queryFn: () => Api.fetchAllDesignations(),
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

  const columns: ColumnDef<KpiFormRow>[] = getColumns(control, remove);

  if (designationLoader) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const designationOptions = designationsData?.designations || [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Record</Button>
      </DialogTrigger>

      <form onSubmit={handleSubmit(console.log)} className="max-h-[80vh]">
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto ">
          <DialogHeader>
            <DialogTitle>Create Performance Record</DialogTitle>
            <DialogDescription>
              Fill the form below to add a new Performance record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="designation">Designation</Label>
              <Controller
                control={control}
                name="designationId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {designationOptions.map((d: IDesignationOption) => (
                          <SelectItem key={d._id} value={d._id}>
                            {d.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <h1 className="font-bold text-lg dark:text-white text-black">
              Key Performance Indicators
            </h1>
            <div className="ml-auto">
              <Button
                type="button"
                onClick={() =>
                  append({ objective: "", indicators: "", weight: "" })
                }
              >
                Add Row
              </Button>
            </div>
            <CustomDataTable columns={columns} data={fields} />
          </div>

          {/* competencies */}
          <div className="space-y-4">
            <h1 className="font-bold text-lg dark:text-white text-black">
              Competencies
            </h1>

            <Button
              type="button"
              className="ml-auto block"
              onClick={() => appendCompetency({ title: "", indicators: [""] })}
            >
              Add Competency
            </Button>

            {competencyFields.map((_, index) => (
              <CompetencyItem
                key={index}
                control={control}
                index={index}
                removeCompetency={removeCompetency}
              />
            ))}
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
