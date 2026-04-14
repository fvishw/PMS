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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DesignationSelection } from "./designationSelection";
import { roles } from "./options";
import { ParentSelection } from "./parentSelection";
import { AdminReviewerSelection } from "./adminReviewerSelection";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import toasterPosition from "@/utils/toaster";
import { IUser, IUserFormData } from "@/types/user";
import dayjs from "dayjs";

export function AddUserModal({
  mode = "add",
  user,
  open,
  onOpenChange,
}: {
  mode?: "add" | "edit";
  user?: IUser;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isEditMode = mode === "edit";
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || "");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<IUserFormData>({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      joiningDate: user?.joiningDate
        ? dayjs(user.joiningDate).format("YYYY-MM-DD")
        : "",
      role: user?.role || "",
      designationId: user?.designation?._id || "",
      parentReviewerId: user?.parentReviewer?._id || "",
      adminReviewerId: user?.adminReviewer?._id || "",
    },
  });

  useEffect(() => {
    if (!isEditMode || !user) {
      return;
    }
    setSelectedRole(user.role);
    reset({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      joiningDate: user.joiningDate
        ? dayjs(user.joiningDate).format("YYYY-MM-DD")
        : "",
      role: user.role,
      designationId: user.designation?._id || "",
      parentReviewerId: user.parentReviewer?._id || "",
      adminReviewerId: user.adminReviewer?._id || "",
    });
  }, [isEditMode, reset, user]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IUserFormData) => {
      if (isEditMode) {
        if (!user) throw new Error("Edit mode requires a user");
        return Api.updateUser(user._id, data);
      }
      return Api.addUser(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "User updated successfully" : "User added successfully",
        toasterPosition,
      );
      if (isEditMode) {
        onOpenChange?.(false);
      } else {
        reset();
        setSelectedRole("");
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(
        `${isEditMode ? "Error updating user" : "Error adding user"}: ${
          error.message
        }`,
        toasterPosition,
      );
    },
  });

  const handleRoleChange = (
    role: string,
    onChange: (value: string) => void,
  ) => {
    setSelectedRole(role);
    onChange(role);
    setValue("parentReviewerId", "");

    if (role !== "employee") {
      setValue("adminReviewerId", "");
    }
  };

  const modalContent = (
    <DialogContent className="sm:max-w-[425px] h-[90vh] overflow-y-auto">
      <form
        onSubmit={handleSubmit((data) => {
          mutate(data);
        })}
      >
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user details and save your changes."
              : "Fill the form below to add a new user to the system."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid  space-y-4 mt-4">
          <div className="grid gap-3">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName", {
                required: "Full Name is required",
              })}
            />
            <ErrorMessage
              errors={errors}
              name="fullName"
              as="p"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john.doe@nexforge.com"
              disabled={isEditMode}
              {...register("email", {
                required: "Email is required",
              })}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              as="p"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+91 9876543210"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
            />
            <ErrorMessage
              errors={errors}
              name="phoneNumber"
              as="p"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="joiningDate">Joining Date</Label>
            <Input
              id="joiningDate"
              type="date"
              {...register("joiningDate", {
                required: "Joining Date is required",
              })}
            />
            <ErrorMessage
              errors={errors}
              name="joiningDate"
              as="p"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            <Controller
              rules={{
                required: "Role is Required",
              }}
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    handleRoleChange(value, field.onChange)
                  }
                  value={field.value}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage
              errors={errors}
              name="role"
              as="p"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="grid gap-3">
            <DesignationSelection
              role={selectedRole}
              control={control}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="grid gap-3">
            <ParentSelection
              control={control}
              setValue={setValue}
              selectedRole={selectedRole}
              errors={errors}
            />
          </div>
          {selectedRole === "employee" && (
            <div className="grid gap-3">
              <AdminReviewerSelection control={control} setValue={setValue} />
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : isEditMode ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (isEditMode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {modalContent}
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      {modalContent}
    </Dialog>
  );
}
