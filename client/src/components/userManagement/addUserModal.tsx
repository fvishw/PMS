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
import { useState } from "react";
import { DesignationSelection } from "./designationSelection";
import { roles } from "./options";
import { ParentSelection } from "./parentSelection";
import { AdminReviewerSelection } from "./adminReviewerSelection";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "../ui/spinner";

export interface AddUserModalProps {
  fullName: string;
  email: string;
  role: string;
  designationId: string;
  parentReviewerId?: string;
  adminReviewerId?: string;
}
export function AddUserModal() {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { register, handleSubmit, reset, control, setValue } =
    useForm<AddUserModalProps>({
      defaultValues: {
        fullName: "",
        email: "",
        role: "",
        designationId: "",
        parentReviewerId: "",
        adminReviewerId: "",
      },
    });

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data: AddUserModalProps) => Api.addUser(data),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
            reset();
          })}
        >
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="john.doe@nexforge.com"
                {...register("email")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      field.onChange(value);
                    }}
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
            </div>
            <div className="grid gap-3">
              <DesignationSelection
                role={selectedRole}
                control={control}
                setValue={setValue}
              />
            </div>
            <div className="grid gap-3">
              <ParentSelection
                control={control}
                setValue={setValue}
                selectedRole={selectedRole}
              />
            </div>
            {selectedRole === "employee" && (
              <div className="grid gap-3">
                <AdminReviewerSelection control={control} setValue={setValue} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
