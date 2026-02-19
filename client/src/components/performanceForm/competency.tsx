import {
  CompetenciesData,
  Competency,
  EditPermissions,
} from "@/types/performance";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import SectionWrapper from "./sectionWrapper";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";

const ratings = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

interface CompetenciesProps {
  competenciesData: CompetenciesData;
  permissions: EditPermissions;
  register: any;
  control: any;
}

function Competencies({
  competenciesData,
  permissions,
  register,
  control,
}: CompetenciesProps) {
  return (
    <SectionWrapper title="Section B: Competency Ratings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {competenciesData?.map((competency: Competency, index: number) => {
          return (
            <div
              className="p-4 border rounded w-full flex flex-col justify-between"
              key={competency.title}
            >
              <h3 className="font-semibold mb-2">{competency.title}</h3>
              <ul className="text-sm text-muted-foreground pl-3 flex flex-col space-y-2">
                {competency.indicators.map((criteria, idx) => (
                  <li key={idx}>{criteria}</li>
                ))}
              </ul>
              {
                <Controller
                  control={control}
                  name={`competencies.${index}.score`}
                  render={({ field }) => {
                    return (
                      <RadioGroup
                        disabled={!permissions.canEditManager}
                        className="flex justify-center items-center mt-4 space-x-4 flex-wrap"
                        onValueChange={field.onChange}
                        defaultValue={competency.score?.toString()}
                      >
                        <Input
                          type="hidden"
                          {...register(`competencies.${index}._id`)}
                          defaultValue={competency._id}
                        />
                        {ratings.map((rating) => (
                          <div
                            key={rating.value}
                            className="flex flex-col items-center space-y-1"
                          >
                            <RadioGroupItem
                              value={rating.value}
                              id={`${competency.title}-${rating.value}`}
                            />
                            <Label
                              htmlFor={`${competency.title}-${rating.value}`}
                              className="mt-1 text-sm"
                            >
                              {rating.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    );
                  }}
                />
              }
            </div>
          );
        })}
      </div>

      {/* comment section */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mt-6">
        <div className="rounded border p-4">
          <Label className="pb-4 font-semibold">
            Employee Area of Strength
          </Label>
          <div>
            <Textarea
              placeholder="Describe the employee's strengths..."
              disabled={!permissions.canEditManager}
              {...register("areaOfStrength", {
                required: permissions.canEditManager
                  ? "This field is required"
                  : false,
              })}
            />
          </div>
        </div>
        <div className="rounded border p-4">
          <Label className="pb-4 font-semibold">Areas for Improvement</Label>
          <div>
            <Textarea
              placeholder="Describe areas where the employee can improve..."
              disabled={!permissions.canEditManager}
              {...register("areaOfImprovement", {
                required: permissions.canEditManager
                  ? "This field is required"
                  : false,
              })}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default Competencies;
