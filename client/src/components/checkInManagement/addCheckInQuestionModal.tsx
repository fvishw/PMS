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
import { Spinner } from "../ui/spinner";
import {
  getColumns,
  QuestionFormPayload,
  QuestionRow,
} from "./questionTable.config";
import { useFieldArray, useForm } from "react-hook-form";
import { CustomDataTable } from "../customTable";

export function AddCheckInQuestionModal() {
  const form = useForm<QuestionFormPayload>({
    defaultValues: {
      questions: [{ question: "", type: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  console.log(fields);

  const columns: ColumnDef<QuestionRow>[] = getColumns(form.control, remove);

  // if (designationLoader) {
  //   return (
  //     <div className="w-full ">
  //       <Spinner className="size-8 text-primary" />
  //     </div>
  //   );
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Question set</Button>
      </DialogTrigger>
      <form onSubmit={form.handleSubmit(console.log)}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Add Questions</DialogTitle>
            <DialogDescription>
              Fill the form below to add new questions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
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
        </DialogContent>
      </form>
    </Dialog>
  );
}
