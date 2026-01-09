import { Label } from "../ui/label";
import SectionWrapper from "./sectionWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  agreementOptions,
  performanceRatingOptions,
  remarkOptions,
} from "./option";
import { Textarea } from "../ui/textarea";
import { EditPermissions, IFinalReview } from "@/types/performance";
import { Controller } from "react-hook-form";

interface FinalReviewProps {
  data: IFinalReview;
  permissions: EditPermissions;
  register: any;
  control: any;
}

function FinalReview({
  data,
  permissions,
  register,
  control,
}: FinalReviewProps) {
  return (
    <SectionWrapper title="Section C: Final Comments">
      <div>
        {/* admin remark section */}
        <div className="border rounded p-4 ">
          <Label className="font-semibold pb-4">
            Admin's Decision And Remark
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4 space-x-3">
            <div>
              <Label className="mb-2">Admin's Remark</Label>
              {
                <Controller
                  control={control}
                  name="finalComments.adminReview.remarks"
                  render={({ field }) => (
                    <Select
                      disabled={!permissions.canEditAdmin}
                      onValueChange={field.onChange}
                      defaultValue={data.adminReview?.remarks || ""}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select remark" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {remarkOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              }
            </div>
            <div>
              <Label className="mb-2">Appraiser's Recommendation</Label>
              {
                <Controller
                  control={control}
                  name="finalComments.adminReview.recommendation"
                  render={({ field }) => (
                    <Select
                      disabled={!permissions.canEditAdmin}
                      onValueChange={field.onChange}
                      defaultValue={data.adminReview?.recommendation || ""}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Recommendation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {performanceRatingOptions.map((performance) => (
                            <SelectItem
                              key={performance.value}
                              value={performance.value}
                            >
                              {performance.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              }
            </div>
          </div>
          <div className="col-span-2 mt-4">
            <Label className=" pb-2">Admin's Final Comments</Label>
            <Textarea
              disabled={!permissions.canEditAdmin}
              placeholder="Enter final comments..."
              {...register("finalComments.adminReview.finalComments")}
              defaultValue={data.adminReview?.finalComments || ""}
            />
          </div>
        </div>
        {/* employee final comments section */}
        <div className="w-full rounded border p-4 mt-4 ">
          <Label className="pb-4 font-semibold">Employee's Comment</Label>
          <div className="space-y-4 grid md:grid-cols-2 grid-cols-1">
            <div>
              <Label className="pb-2">Employee Remark</Label>
              {
                <Controller
                  control={control}
                  name="finalComments.selfReview.remarks"
                  render={({ field }) => (
                    <Select
                      disabled={!permissions.canEditUserFinalComments}
                      onValueChange={field.onChange}
                      defaultValue={data.selfReview?.remarks || ""}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Recommendation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {agreementOptions.map((performance) => (
                            <SelectItem
                              key={performance.value}
                              value={performance.value}
                            >
                              {performance.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              }
            </div>
            <div>
              <Label className="pb-2">Employee Final Comment</Label>
              <Textarea
                placeholder="Enter final comments..."
                disabled={!permissions.canEditUserFinalComments}
                {...register("finalComments.selfReview.comments")}
                defaultValue={data.selfReview?.comments || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default FinalReview;
