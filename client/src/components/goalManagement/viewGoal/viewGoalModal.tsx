import Api from "@/api/api";
import ApiError from "@/components/errorMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

interface ViewGoalModalProps {
  goalId: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface ViewGoalFormValues {
  goalId: string;
  subTasks: {
    _id: string;
    isCompleted: boolean;
  }[];
}

export const ViewGoalModal = ({
  goalId,
  isOpen,
  onClose,
}: ViewGoalModalProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: async () => Api.getGoalById(goalId),
  });
  const { register, control, handleSubmit, reset } =
    useForm<ViewGoalFormValues>({
      defaultValues: {
        goalId: "",
        subTasks: [],
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ViewGoalFormValues) =>
      Api.markGoalAsComplete(data),
    onSuccess: () => {
      toast.success("Goal updated successfully", {
        position: "top-right",
      });
      onClose();
    },
  });

  const onSubmit = (formData: ViewGoalFormValues) => {
    mutate({ ...formData, goalId });
  };

  useEffect(() => {
    if (!data?.goal) return;
    reset({
      goalId: data.goal._id,
      subTasks: data.goal.subTasks.map((subTask: any) => ({
        _id: subTask._id,
        isCompleted: !!subTask.isCompleted,
      })),
    });
  }, [data?.goal, goalId, reset]);

  let contentToRender;
  if (isLoading) {
    contentToRender = <Spinner />;
  }
  if (error) {
    contentToRender = <ApiError message={error.message || "Unknown error"} />;
  }
  if (data) {
    const goal = data?.goal;
    contentToRender = (
      <div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3 className="text-lg font-medium">{goal.title}</h3>
          </div>
          <div className="space-y-2">
            {goal.subTasks.map((subTask: any, index: number) => (
              <div className="flex space-x-3" key={subTask._id}>
                <Input
                  type="hidden"
                  value={subTask._id}
                  {...register(`subTasks.${index}._id`)}
                />
                <Controller
                  name={`subTasks.${index}.isCompleted`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`subTasks.${index}.isCompleted`}
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  )}
                />
                <Label htmlFor={`subTasks.${index}.isCompleted`}>
                  {subTask.title}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {isPending ? "Updating..." : "Update Goal"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Goal Details</DialogTitle>
          <DialogDescription>
            View detailed information about the selected goal.
          </DialogDescription>
        </DialogHeader>
        {contentToRender}
      </DialogContent>
    </Dialog>
  );
};
