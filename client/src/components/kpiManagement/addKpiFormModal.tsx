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
import { getColumns } from "./addKpiTable.config";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { DataTable, KpiForm, KpiFormRow } from "./addKpiTable";



export function AddKpiFormModal() {
  const form = useForm<KpiForm>({
    defaultValues: {
      designationId: "",
      kpis: [{ objective: "", indicators: "", weight: "" }],
    },
  });
  const { data: designationsData, isPending: designationLoader } = useQuery({
    queryKey: ["designations"],
    queryFn: () => Api.fetchAllDesignations(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "kpis",
  });

  const columns: ColumnDef<KpiFormRow>[] = getColumns(form.control, remove);

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
        <Button variant="outline">Add KPI</Button>
      </DialogTrigger>
      <form onSubmit={form.handleSubmit(console.log)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add KPI</DialogTitle>
            <DialogDescription>
              Fill the form below to add a new KPI.
            </DialogDescription>
          </DialogHeader>
          <div className="grid space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="designation">Designation</Label>
              <Controller
                control={form.control}
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

            <div className="ml-auto">
              <Button
                type="button"
                onClick={() =>
                  append({ objective: "", indicators: "", weight: "" })
                }
              >
                Add Kpi
              </Button>
            </div>
            <DataTable columns={columns} data={fields} />
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
