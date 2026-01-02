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
import position from "@/utils/toaster";
import { useForm } from "react-hook-form";
import { roles } from "./options";

interface AddDesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface AddDesignationForm {
  title: string;
  role: "employee" | "manager" | "admin";
}

export const AddDesignationModal = ({
  isOpen,
  onClose,
}: AddDesignationModalProps) => {
  const { register, handleSubmit, reset } = useForm<AddDesignationForm>({
    defaultValues: {
      title: "",
      role: "employee",
    },
  });

  const { mutate: addDesignation } = useMutation({
    mutationFn: (data: AddDesignationForm) => Api.addDesignation(data),
    onSuccess: () => {
      toast.success("Designation added successfully", position);
      reset();
      queryClient.invalidateQueries({ queryKey: ["designations"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to add designation", position);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit((data) => addDesignation(data))}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Add Designation</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent onChange={() => {}}>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
            <Button type="submit">Add Designation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
