import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Goal } from "@/types/goal";
import { useFieldArray, useForm } from "react-hook-form";
import { UserSelection } from "./userSelection";
import { Label } from "@/components/ui/label";
import SubTaskItem from "./subTaskItem";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";

interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function GoalFormDialog({ isOpen, onClose }: GoalFormDialogProps) {
  const { control, reset, handleSubmit, register } = useForm<Goal>({
    defaultValues: {
      title: "",
      subTasks: [
        {
          title: "",
        },
      ],
      dueDate: "",
      owner: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Goal) => Api.addGoalByAdmin(data),
    onSuccess: () => {
      reset();
      toast.success("Goal Add Successfully.", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong while add Goal.");
    },
  });

  const {
    append,
    fields: subTasksFields,
    remove,
  } = useFieldArray({
    name: `subTasks`,
    control,
  });

  const onSubmit = (data: Goal) => {
    if (!data.dueDate) {
      toast.error("Due date is required.");
      return;
    }
    const parsedData: Goal = {
      ...data,
      dueDate: new Date(data.dueDate),
    };
    mutate(parsedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new goal</DialogTitle>
          <DialogDescription>
            Set a clear outcome, track progress, and align with performance
            reviews.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Goal title</Label>
              <Input
                placeholder="Increase customer retention to 92%"
                {...register("title", { required: true })}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                className="flex"
                onClick={() =>
                  append({
                    title: "",
                  })
                }
              >
                <span className="flex ">
                  <IconPlus /> Sub Task
                </span>
              </Button>
            </div>
            <div>
              <Label>Sub Tasks</Label>
              {subTasksFields.map((field, index) => (
                <SubTaskItem
                  index={index}
                  control={control}
                  key={field.id}
                  removeSubTask={remove}
                />
              ))}
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">Owner</Label>
              <UserSelection control={control} />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Due date</span>
              <Input type="date" {...register("dueDate", { required: true })} />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GoalFormDialog;
