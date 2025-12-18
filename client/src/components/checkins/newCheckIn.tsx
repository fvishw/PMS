import { id } from "zod/v4/locales";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const criteriaOptions = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const checkIns = [
  {
    id: 1,
    type: "radio",
    criteria: "My Manager sets clear expectations",
  },
  {
    id: 2,
    type: "radio",
    criteria: "My Manager Communicates effectively",
  },
  {
    id: 3,
    type: "radio",
    criteria: "My Manager provides useful guidance and coaching",
  },
  {
    id: 4,
    type: "radio",
    criteria: "I feel comfortable concerns with my Manager",
  },
  {
    id: 5,
    type: "radio",
    criteria: "I felt productive this month",
  },
  {
    id: 6,
    type: "textarea",
    criteria: "What accomplishments are you proud of this month?",
  },
  {
    id: 7,
    type: "textarea",
    criteria: "What challenges did you face , and how did you overcome them?",
  },
  {
    id: 8,
    type: "textarea",
    criteria: "What do to plan to achieve next month?",
  },
];

function NewCheckIn() {
  return (
    <div className="w-full space-y-4 mt-2">
      {checkIns.map((checkIn) => (
        <div key={checkIn.id} className="space-y-2 border p-4 rounded flex ">
          <label className="font-medium w-[500px] ">{checkIn.criteria}</label>
          {checkIn.type === "radio" ? (
            <div className="flex flex-col space-y-1">
              <RadioGroup className="flex justify-center items-center mt-4 space-x-4">
                {criteriaOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center space-y-1"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`${checkIn.criteria}-${option}`}
                    />
                    <Label
                      htmlFor={`${checkIn.criteria}-${option}`}
                      className="mt-1 text-sm"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <Textarea
              name={`checkin-${checkIn.id}`}
              className="border border-gray-300 rounded-md p-2 w-lg"
              rows={4}
            ></Textarea>
          )}
        </div>
      ))}
    </div>
  );
}

export default NewCheckIn;
