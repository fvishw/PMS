import { CompetenciesData, Competency } from "@/types/performance";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import SectionWrapper from "@/components/performanceForm/sectionWrapper";

const ratings = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

interface CompetenciesProps {
  data: CompetenciesData;
}

function CompetenciesView({ data }: CompetenciesProps) {
  return (
    <SectionWrapper title="Section B: Competency Ratings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {data?.map((competency: Competency) => {
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
              <RadioGroup className="flex justify-center items-center mt-4 space-x-4 flex-wrap">
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
            </div>
          );
        })}
      </div>

      {/* comment section */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mt-6">
        <div className="rounded border p-4">
          <Label className="pb-4 font-semibold">
            Employee Area of strength
          </Label>
          <div>
            <Textarea placeholder="Describe the employee's strengths..." />
          </div>
        </div>
        <div className="rounded border p-4">
          <Label className="pb-4 font-semibold">Areas for Improvement</Label>
          <div>
            <Textarea placeholder="Describe areas where the employee can improve..." />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default CompetenciesView;
