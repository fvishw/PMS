import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import SectionWrapper from "./sectionWrapper";

interface ICompetencyRating {
  name: string;
  ratingCriteria: string[];
}

const competencyRatings: ICompetencyRating[] = [
  {
    name: "Communication",
    ratingCriteria: [
      "Rarely communicates clearly",
      "Sometimes clear, but needs much improvement",
      "Communicates effectively in most situations",
      "Clear, concise, and respectful communicator",
      "Consistently articulate, persuasive, and attentive",
    ],
  },
  {
    name: "Problem Solving",
    ratingCriteria: [
      "Struggles to identify problems or build solutions",
      "Occasionally solves problems, but needs guidance",
      "Resolves common issues with minimal support",
      "Proactively analyzes issues and finds solutions",
      "Consistently solves complex problems",
    ],
  },
  {
    name: "Leadership",
    ratingCriteria: [
      "Does not take initiative or inspire others",
      "Occasionally takes charge but lacks consistency",
      "Shows basic leadership and also guides others",
      "Motivates, supports, and leads teams effectively",
      "Inspires trust, drives results, and always leads",
    ],
  },
  {
    name: "Collaboration and Teamwork",
    ratingCriteria: [
      "Rarely works well with others",
      "Occasionally contributes to team efforts",
      "Participates actively with team members",
      "Builds positive relationships with others",
      "Initiates and fosters strong collaboration",
    ],
  },
];

const ratings = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

function Competencies() {
  return (
    <SectionWrapper title="Section B: Competency Ratings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {competencyRatings.map((competency) => {
          return (
            <div className="p-4 border rounded w-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2">{competency.name}</h3>
              <p className="text-sm text-muted-foreground pl-3 flex flex-col space-y-2">
                {competency.ratingCriteria.map((criteria, idx) => (
                  <li key={idx}>{criteria}</li>
                ))}
              </p>
              <RadioGroup className="flex justify-center items-center mt-4 space-x-4">
                {ratings.map((rating) => (
                  <div
                    key={rating.value}
                    className="flex flex-col items-center space-y-1"
                  >
                    <RadioGroupItem
                      value={rating.value}
                      id={`${competency.name}-${rating.value}`}
                    />
                    <Label
                      htmlFor={`${competency.name}-${rating.value}`}
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
          <Label className="pb-4 font-semibold">
            Areas for Improvement
          </Label>
          <div>
            <Textarea placeholder="Describe areas where the employee can improve..." />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default Competencies;
