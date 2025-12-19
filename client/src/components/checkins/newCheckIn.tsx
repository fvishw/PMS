import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import criteriaOptions from "./options";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import Api from "@/api/api";
import { CheckInPayload } from "@/types/chekin";

const checkIns = [
  {
    id: 1,
    type: "rating",
    question: "My Manager sets clear expectations",
  },
  {
    id: 2,
    type: "rating",
    question: "My Manager Communicates effectively",
  },
  {
    id: 3,
    type: "rating",
    question: "My Manager provides useful guidance and coaching",
  },
  {
    id: 4,
    type: "rating",
    question: "I feel comfortable concerns with my Manager",
  },
  {
    id: 5,
    type: "rating",
    question: "I felt productive this month",
  },
  {
    id: 6,
    type: "text",
    question: "What accomplishments are you proud of this month?",
  },
  {
    id: 7,
    type: "text",
    question: "What challenges did you face , and how did you overcome them?",
  },
  {
    id: 8,
    type: "text",
    question: "What do to plan to achieve next month?",
  },
];

export type CheckInFormValue = {
  question: string;
  answer: string;
  type: "rating" | "text";
};

function NewCheckIn() {
  const { mutate } = useMutation({
    mutationFn: (data: CheckInPayload) => Api.addCheckIns(data),
    onSuccess: () => {
      // Invalidate and refetch
    },
    onError: () => {
      // Show error message
    },
  });
  const { register, handleSubmit, setValue } = useForm<CheckInFormValue[]>();

  const onSubmit = (data: CheckInPayload) => {
    mutate(data);
  };

  return (
    <div className="w-full space-y-4 mt-2">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {checkIns.map((checkIn, idx) => (
          <div key={checkIn.id} className="space-y-2 border p-4 rounded flex ">
            <label className="font-medium w-[500px] ">{checkIn.question}</label>
            {checkIn.type === "rating" ? (
              <div className="flex flex-col space-y-1">
                <RadioGroup
                  className="flex justify-center items-center mt-4 space-x-4"
                  onValueChange={(value) => setValue(`${idx}.answer`, value)}
                >
                  {criteriaOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center space-y-1"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${checkIn.question}-${option.value}`}
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
                className="border border-gray-300 rounded-md p-2 w-lg"
                rows={4}
                {...register(`${idx}.answer`)}
              ></Textarea>
            )}
            <Input
              type="hidden"
              {...register(`${idx}.type`)}
              value={checkIn.type}
            />
            <Input
              type="hidden"
              {...register(`${idx}.question`)}
              value={checkIn.question}
            />
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <Button type="submit">Submit Check-In</Button>
        </div>
      </form>
    </div>
  );
}

export default NewCheckIn;
