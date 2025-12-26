import Api from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconEye } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import QuestionManagement from "../questionSet/Question";
import CheckInQuestionAns from "@/components/checkIns/checkInQuestionAns";

export const UserPastCheckInModal = ({ checkInId }: { checkInId: string }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["employeePastCheckIns", checkInId],
    queryFn: async () => Api.fetchCheckIn(checkInId),
    enabled: !!checkInId,
  });
  console.log(data);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconEye size={20} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <div className="overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Past Check-In for</DialogTitle>
            <DialogDescription>
              Fill the form below to add new questions.
            </DialogDescription>
          </DialogHeader>
          <CheckInQuestionAns
            questions={data?.answers || null}
            isPastCheckIn={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
