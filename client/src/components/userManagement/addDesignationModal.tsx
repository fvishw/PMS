import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { queryClient } from "@/utils/queryClient";
import Api from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import toasterPosition from "@/utils/toaster";
import { Controller, useForm } from "react-hook-form";
import { roles } from "./options";
import { Designation } from "@/types/user";

interface AddDesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  designation?: Designation;
}
interface AddDesignationForm {
  title: string;
  role: "employee" | "manager" | "admin";
}

export const AddDesignationModal = ({
  isOpen,
  onClose,
  mode = "add",
  designation,
}: AddDesignationModalProps) => {
  const isEditMode = mode === "edit";
  const { register, handleSubmit, reset, control } =
    useForm<AddDesignationForm>({
      defaultValues: {
        title: designation?.title || "",
        role: designation?.role || "employee",
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddDesignationForm) => {
      if (isEditMode && designation) {
        return Api.updateDesignation(designation._id, data);
      }
      return Api.addDesignation(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Designation updated successfully"
          : "Designation added successfully",
        toasterPosition,
      );
      reset();
      queryClient.invalidateQueries({ queryKey: ["designations"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message, toasterPosition);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Designation" : "Add Designation"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the designation title and role."
                : "Add a new designation by selecting a role and entering a title."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Software Engineer"
                {...register("title")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Designation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
