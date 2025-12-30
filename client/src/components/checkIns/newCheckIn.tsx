import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import Api from "@/api/api";
import { CheckInPayload } from "@/types/chekin";
import { Spinner } from "../ui/spinner";
import CheckInQuestionAns from "./checkInQuestionAns";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";

export type CheckInFormValue = {
  questionId: string;
  answer: string;
};

function NewCheckIn() {
  const { mutate } = useMutation({
    mutationFn: (data: CheckInPayload) => Api.addCheckIns(data),
    onSuccess: () => {
      toast.success("Check-In submitted successfully!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["getCheckIns"] });
    },
    onError: (error) => {
      toast.error(`Error submitting Check-In: ${error}`, {
        position: "top-right",
      });
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["getCheckIns"],
    queryFn: () => Api.getCheckIns(),
  });
  const { register, handleSubmit, setValue } = useForm<CheckInFormValue[]>();

  const version = data?.questions[0]?.version || "";

  const onSubmit = (data: CheckInPayload) => {
    const ansPayload = [];
    console.log(data);
    for (const [_, value] of Object.entries(data)) {
      ansPayload.push(value);
    }
    const payload = {
      version: version,
      answers: ansPayload,
    };
    mutate(payload);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const content =
    data && data?.questions?.length === 0 ? (
      <div className="w-full text-center text-gray-500 ">
        No active check-in questions available.
      </div>
    ) : (
      <div className="w-full flex flex-col space-y-4">
        <CheckInQuestionAns
          questions={data?.questions || null}
          register={register}
          setValue={setValue}
          isPastCheckIn={false}
        />
        <Button type="submit" className="ml-auto">
          Submit Check-In
        </Button>
      </div>
    );
  return (
    <div className="w-full space-y-4 mt-2">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end mt-4">{content}</div>
      </form>
    </div>
  );
}

export default NewCheckIn;
