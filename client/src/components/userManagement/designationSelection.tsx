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
import { IDesignationOption } from "@/types/user";
import { Controller, UseFormSetValue } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { IUserFormData } from "@/types/user";

export const DesignationSelection = ({
  role,
  control,
  setValue,
  errors,
}: {
  role: string;
  control: any;
  setValue: UseFormSetValue<IUserFormData>;
  errors: any;
}) => {
  const { data: designationsData, isLoading } = useQuery({
    queryKey: ["designations", role],
    queryFn: ({ queryKey }) => Api.fetchAllDesignations(queryKey[1]),
    enabled: role !== "",
  });

  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  const designationOptions = designationsData?.designations || [];
  return (
    <>
      <Label htmlFor="designation">Designation</Label>
      <div className="flex gap-3">
        <Controller
          rules={{
            required: "Designation is Required",
          }}
          name="designationId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                setValue("designationId", value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {designationOptions.map((designation: IDesignationOption) => (
                    <SelectItem key={designation._id} value={designation._id}>
                      {designation.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="designationId"
        as="p"
        className="text-red-500 text-sm"
      />
    </>
  );
};
