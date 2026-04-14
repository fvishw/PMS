import Api from "@/api/api";
import ApiErrorMessage from "@/components/ApiErrorMessage";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { queryClient } from "@/utils/queryClient";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import SubTaskItem from "./subTaskItem";
import { Goal, UpdateGoalPayload } from "@/types/goal";

interface EditGoalModalProps {
  goalId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditGoalModal = ({
  goalId,
  isOpen,
  onClose,
}: EditGoalModalProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: async () => Api.getGoalById(goalId),
    enabled: isOpen && !!goalId,
  });

  const { control, reset, handleSubmit, register } = useForm<Goal>({
    defaultValues: {
      _id: "",
      title: "",
      subTasks: [{ title: "" }],
      dueDate: "",
      owner: "",
    },
  });

  const {
    append,
    fields: subTasksFields,
    remove,
  } = useFieldArray({
    name: "subTasks",
    control,
  });

  useEffect(() => {
    if (!data?.goal) return;
    const goal = data.goal;
    reset({
      _id: goal._id,
      title: goal.title,
      owner: goal.owner,
      dueDate: dayjs(goal.dueDate).format("YYYY-MM-DD"),
      subTasks: goal.subTasks.map((subTask) => ({
        _id: subTask._id,
        title: subTask.title,
      })),
    });
  }, [data, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: UpdateGoalPayload) =>
      Api.updateGoalById(goalId, formData),
    onSuccess: () => {
      toast.success("Goal updated successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
      onClose();
    },
    onError: (mutationError) => {
      toast.error(mutationError.message || "Failed to update goal");
    },
  });

  const onSubmit = (formData: Goal) => {
    if (!formData.dueDate) {
      toast.error("Due date is required.");
      return;
    }
    mutate({
      title: formData.title,
      subTasks: formData.subTasks.map((subTask) => ({
        _id: subTask._id,
        title: subTask.title,
      })),
      dueDate: new Date(formData.dueDate),
    });
  };

  let contentToRender;
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }
  if (error) {
    contentToRender = (
      <ApiErrorMessage message={error.message || "Unable to fetch goal"} />
    );
  }
  if (data?.goal) {
    contentToRender = (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Goal title</Label>
            <Input {...register("title", { required: true })} />
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
            <span className="text-sm font-medium">Due date</span>
            <Input type="date" {...register("dueDate", { required: true })} />
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Goal"}
          </Button>
        </DialogFooter>
      </form>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update goal details. Status can only be changed from task completion
            by owner or manager.
          </DialogDescription>
        </DialogHeader>
        {contentToRender}
      </DialogContent>
    </Dialog>
  );
};
