import { queryClient } from "@/utils/queryClient";
import ApiError from "../errorMessage";
import { KpiCriteria } from "@/types/criteria";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Api from "@/api/api";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { termsAndConditions } from "@/types/termsAndConditions";
import Criteria from "../ui/criteria";

const KpiDetails = ({ criteria }: { criteria: KpiCriteria[] }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => Api.submitUserKpis(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userKpiDetails"] });
    },
  });

  const handleSubmit = () => {
    mutate();
  };
  if (error) {
    return <ApiError message={error.message} />;
  }
  return (
    <>
      <div className="border p-4 rounded-md flex justify-between items-center">
        <h2 className="">Performance Indicators</h2>
        <p className="md:pr-4 sm:">Weights</p>
      </div>

      {criteria.map((criteria) => (
        <Criteria
          key={criteria.id}
          id={criteria.id}
          objective={criteria.objective}
          indicator={criteria.indicator}
          weight={criteria.weight}
        />
      ))}

      <div className="border p-4 rounded-md">
        <div className="grid grid-cols-1  sm:grid-cols-3 space-y-5 space-x-2 items-center justify-evenly">
          <div className="space-y-2 grid col-span-2">
            <h3 className="font-semibold">Important Instructions:</h3>
            <ul className="list-disc list-inside  text-sm">
              {termsAndConditions.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms-2"
              onCheckedChange={(checked) => setIsChecked(Boolean(checked))}
              checked={isChecked}
            />
            <div className="flex  flex-col gap-2">
              <Label htmlFor="terms-2">Accept terms and conditions</Label>
              <p className="text-muted-foreground text-sm">
                By clicking this checkbox, you agree to the terms and
                conditions.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 sm:mt-0 pr-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || isChecked === false}
          >
            {isPending ? "Submitting..." : "Submit KPIs"}
          </Button>
        </div>
      </div>
    </>
  );
};
export default KpiDetails;
