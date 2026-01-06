import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { parentRoleMapper } from "./options";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export const ParentSelection = ({
  selectedRole,
  control,
  setValue,
  errors,
}: {
  selectedRole: string;
  control: any;
  setValue: any;
  errors: any;
}) => {
  const parentRole = parentRoleMapper[selectedRole];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["designations", parentRole],
    queryFn: ({ queryKey }) => Api.fetchUsersByRole(queryKey[1]),
    enabled: [null, undefined, ""].indexOf(parentRole) === -1,
  });
  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  return (
    <>
      <Label htmlFor="parentReviewer">Parent Reviewer</Label>
      <Controller
        name="parentReviewerId"
        rules={{
          required: "Parent Reviewer is Required",
        }}
        control={control}
        render={({ field }) => (
          <>
            <Select
              onValueChange={(value) => {
                setValue("parentReviewerId", value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a parent reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data?.users?.map((user: any) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.fullName} ({user.role})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage
              errors={errors}
              name="parentReviewerId"
              as="p"
              className="text-red-500 text-sm"
            />
          </>
        )}
      />
    </>
  );
};
