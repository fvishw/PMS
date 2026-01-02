import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, UseFormSetValue } from "react-hook-form";
import { AddUserModalProps } from "./addUserModal";

export const AdminReviewerSelection = ({
  control,
  setValue,
}: {
  control: any;
  setValue: UseFormSetValue<AddUserModalProps>;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["designations", "admin"],
    queryFn: ({ queryKey }) => Api.fetchUsersByRole(queryKey[1]),
  });

  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  console.log(data);
  return (
    <>
      <Label htmlFor="adminReviewer">Admin Reviewer</Label>
      <Controller
        name="adminReviewerId"
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(value) => {
              setValue("adminReviewerId", value);
            }}
            value={field.value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an admin reviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data &&
                  data?.users?.length > 0 &&
                  data?.users?.map((user: any) => (
                    <SelectItem key={user.id} value={user._id}>
                      {user.fullName} ({user.role})
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </>
  );
};
