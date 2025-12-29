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
import {
  getColumns,
  QuestionFormPayload,
  QuestionRow,
} from "./addQuestionTable.config";
import { useFieldArray, useForm } from "react-hook-form";
import { CustomDataTable } from "../../customTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Api from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export function AddCheckInQuestionModal() {
  const { control, handleSubmit, register } = useForm<QuestionFormPayload>({
    defaultValues: {
      questions: [{ question: "", type: "" }],
      version: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const columns: ColumnDef<QuestionRow>[] = getColumns(control, remove);

  const { mutate } = useMutation({
    mutationFn: (data: QuestionFormPayload) => Api.addCheckInsQuestions(data),
    onSuccess: () => {
      toast.success("Questions added successfully", {
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add questions", {
        position: "top-right",
      });
    },
  });

  const onSubmit = (data: QuestionFormPayload) => {
    console.log(data)
    mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Question set</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Questions</DialogTitle>
            <DialogDescription>
              Fill the form below to add new questions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="version">Question Version</Label>
              <Input
                {...register("version", { required: true })}
                className="w-[200px]"
                placeholder="v.1"
                id="version"
              />
            </div>
            <div className="ml-auto">
              <Button
                type="button"
                onClick={() => append({ question: "", type: "" })}
              >
                Add Question
              </Button>
            </div>
            <CustomDataTable columns={columns} data={fields} />
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
