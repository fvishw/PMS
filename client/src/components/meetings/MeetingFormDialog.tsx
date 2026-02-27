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
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import useUser from "@/hooks/useUser";
import { UserSelect } from "../common/userSelect";

interface MeetingFormValues {
  title: string;
  employee: string;
  meetingDate: string;
}

interface MeetingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    _id: string;
    title: string;
    employee: string;
    meetingDate: string;
  };
}

function MeetingFormDialog({ isOpen, onClose, editData }: MeetingFormDialogProps) {
  const { data: users, isLoading: usersLoading } = useUser();
  const isEditMode = !!editData;

  const { reset, handleSubmit, register, setValue, watch } =
    useForm<MeetingFormValues>({
      defaultValues: {
        title: editData?.title || "",
        employee: editData?.employee || "",
        meetingDate: editData?.meetingDate
          ? new Date(editData.meetingDate).toISOString().split("T")[0]
          : "",
      },
    });

  const employeeValue = watch("employee");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MeetingFormValues) => {
      if (isEditMode) {
        return Api.updateMeeting(editData._id, {
          title: data.title,
          meetingDate: data.meetingDate,
        });
      }
      return Api.createMeeting(data);
    },
    onSuccess: () => {
      reset();
      toast.success(
        isEditMode
          ? "Meeting updated successfully."
          : "Meeting scheduled successfully.",
        { position: "top-right" },
      );
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const onSubmit = (data: MeetingFormValues) => {
    if (!data.meetingDate) {
      toast.error("Meeting date is required.");
      return;
    }
    if (!data.employee && !isEditMode) {
      toast.error("Employee is required.");
      return;
    }
    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Meeting" : "Schedule a Meeting"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the meeting details."
              : "Schedule a one-on-one meeting with an employee."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                placeholder="Weekly 1:1 Sync"
                {...register("title", { required: true })}
              />
            </div>

            {!isEditMode && (
              <div className="grid gap-2">
                <Label>Employee</Label>
                <UserSelect
                  users={users || []}
                  value={employeeValue || undefined}
                  onChange={(val) => setValue("employee", val)}
                  placeholder="Select employee"
                  isLoading={usersLoading}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Meeting Date</Label>
              <Input
                type="date"
                {...register("meetingDate", { required: true })}
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Scheduling..."
                : isEditMode
                  ? "Update Meeting"
                  : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingFormDialog;
