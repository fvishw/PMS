import Api from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import Criteria from "../ui/criteria";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";

const termsAndConditions: string[] = [
  "I confirm that I have reviewed and understood the performance indicators outlined above.",
  "I acknowledge that these KPIs will be used to evaluate my performance for the current review period.",
  "I agree to work towards achieving the specified KPIs to the best of my abilities.",
  "I understand that failure to meet these KPIs may impact my overall performance evaluation.",
];

function Kpis() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { isLoading, data, error } = useQuery({
    queryKey: ["kpis"],
    queryFn: () => Api.fetchUserKpiDetails(),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: () => Api.submitUserKpis(),
  });
  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const handleSubmit = () => {
    mutate();
  };
  return (
    <div className="px-4">
      <div className="border p-4 rounded-md mb-4 flex justify-between items-center">
        <h2 className="">Performance Indicators</h2>
        <p className="md:pr-4 sm:">Weightage</p>
      </div>

      {data?.criteria?.map((criteria) => (
        <Criteria
          key={criteria.id}
          id={criteria.id}
          objective={criteria.objective}
          indicator={criteria.indicator}
          weight={criteria.weight}
        />
      )) || <p>No KPIs found.</p>}

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
            <Checkbox id="terms-2" onClick={() => setIsChecked(!isChecked)} />
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
    </div>
  );
}

export default Kpis;
