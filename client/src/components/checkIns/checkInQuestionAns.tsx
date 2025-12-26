import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import criteriaOptions from "./options";

type IQuestion = {
  _id: string;
  question: string;
  type: "rating" | "text";
};

interface CheckInQuestionAnsProps {
  questions: IQuestion[] | null;
  isPastCheckIn: boolean;
  register?: any;
  setValue?: any;
}

function CheckInQuestionAns(props: CheckInQuestionAnsProps) {
  const { questions, register, setValue, isPastCheckIn } = props;

  return (
    <div className="overflow-x-hidden space-y-4">
      {questions?.map((checkIn, idx) => (
        <div key={checkIn._id} className="space-y-2 border p-4 rounded flex ">
          <label className="font-medium w-[500px] flex items-center">
            {checkIn.question}
          </label>
          {checkIn.type === "rating" ? (
            <div className="flex flex-col space-y-1">
              <RadioGroup
                className="flex justify-center items-center mt-4 space-x-4"
                {...(isPastCheckIn
                  ? {}
                  : {
                      onValueChange: (value) =>
                        setValue(`${idx}.answer`, value),
                    })}
                defaultValue={checkIn?.answer || ""}
              >
                {criteriaOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center space-y-1"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${checkIn.question}-${option.value}`}
                      disabled={isPastCheckIn}
                    />
                    <Label
                      htmlFor={`${checkIn.question}-${option.value}`}
                      className="mt-1 text-sm"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <Textarea
              {...(isPastCheckIn ? {} : register(`${idx}.answer`))}
              className="border border-gray-300 rounded-md p-2 w-lg"
              readOnly={isPastCheckIn}
              defaultValue={checkIn?.answer || ""}
            ></Textarea>
          )}
          <Input
            type="hidden"
            {...(isPastCheckIn ? {} : register(`${idx}.questionId`))}
            value={checkIn._id}
          />
        </div>
      ))}
    </div>
  );
}

export default CheckInQuestionAns;
