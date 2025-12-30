import Api from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { IDesignationOption } from "@/types/user";

const roles = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "employee",
    label: "Employee",
  },
];

export function AddUserModal() {
  const { data: designationsData, isPending: designationLoader } = useQuery({
    queryKey: ["designations"],
    queryFn: () => Api.fetchAllDesignations(),
  });

  if (designationLoader) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const designationOptions = designationsData?.designations || [];

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
              <Input id="fullName" name="fullName" placeholder="John Doe" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="john.doe@nexforge.com"
              />
            </div>
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
              <Label htmlFor="designation">Designation</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a designation" />
                </SelectTrigger>
                <SelectContent onChange={() => {}}>
                  <SelectGroup>
                    {designationOptions.map(
                      (designation: IDesignationOption) => (
                        <SelectItem
                          key={designation._id}
                          value={designation._id}
                        >
                          {designation.title}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="parentReviewer">Parent Reviewer</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a parent reviewer" />
                </SelectTrigger>
                <SelectContent onChange={() => {}}>
                  <SelectGroup>
                    {designationOptions.map((designation: any) => (
                      <SelectItem key={designation._id} value={designation._id}>
                        {designation.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="adminReviewer">Admin Reviewer</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select an admin reviewer" />
                </SelectTrigger>
                <SelectContent onChange={() => {}}>
                  <SelectGroup>
                    {designationOptions.map((designation: any) => (
                      <SelectItem key={designation._id} value={designation._id}>
                        {designation.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
