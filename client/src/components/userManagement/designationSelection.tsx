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
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { AddDesignationModal } from "./addDesignationModal";
import { Controller, UseFormSetValue } from "react-hook-form";
import { AddUserModalProps } from "./addUserModal";
import { ErrorMessage } from "@hookform/error-message";

export const DesignationSelection = ({
  role,
  control,
  setValue,
  errors,
}: {
  role: string;
  control: any;
  setValue: UseFormSetValue<AddUserModalProps>;
  errors: any;
}) => {
  const { data: designationsData, isLoading } = useQuery({
    queryKey: ["designations", role],
    queryFn: ({ queryKey }) => Api.fetchAllDesignations(queryKey[1]),
    enabled: role !== "",
  });

  const [isOpen, setIsOpen] = useState(false);

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
              <SelectTrigger className="w-[200px]">
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

        <Button
          className="flex items-center"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <span>
            <IconPlus size={15} />
          </span>
          <span>Add</span>
        </Button>
      </div>
      <ErrorMessage
        errors={errors}
        name="fullName"
        as="p"
        className="text-red-500 text-sm"
      />
      {isOpen && (
        <AddDesignationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};
