import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDesignationOption } from "@/types/user";
import { Spinner } from "../ui/spinner";
import { Controller } from "react-hook-form";

interface DesignationProps {
  control: any;
}

function DesignationSelection({ control }: DesignationProps) {
  const { data: designationsData, isPending: designationLoader } = useQuery({
    queryKey: ["designations"],
    queryFn: () => Api.fetchAllDesignations(),
  });
  const designationOptions = designationsData?.designations || [];

  return (
    <>
      {designationLoader ? (
        <div className="w-full h-full flex justify-center items-center ">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : (
        <Controller
          control={control}
          name="designationId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {designationOptions.map((d: IDesignationOption) => (
                    <SelectItem
                      key={d._id}
                      value={d._id}
                      className="capitalize"
                    >
                      {d.title} - ({d.role})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      )}
    </>
  );
}

export default DesignationSelection;
