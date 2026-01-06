import Api from "@/api/api";
import {
  DialogDescription,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import CheckInQuestionAns from "@/components/checkIns/checkInQuestionAns";
import { Spinner } from "@/components/ui/spinner";
import ApiError from "@/components/errorMessage";

export const UserPastCheckInModal = ({
  checkInId,
  isOpen,
  onClose,
}: {
  checkInId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["employeePastCheckIns", checkInId],
    queryFn: () => Api.fetchCheckIn(checkInId),
    enabled: !!checkInId,
  });
  let dataToRender;

  if (error) {
    return <ApiError message={error.message} />;
  }

  if (isLoading) {
    dataToRender = (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  } else if (data && Array.isArray(data.answers) && data.answers.length > 0) {
    const answers = data.answers;
    dataToRender = (
      <CheckInQuestionAns questions={answers} isPastCheckIn={true} />
    );
  } else {
    dataToRender = <ApiError message="No check-in answers found." />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Past Check-In for</DialogTitle>
          <DialogDescription>
            View the submitted check-in responses below.
          </DialogDescription>
        </DialogHeader>
        {dataToRender}
      </DialogContent>
    </Dialog>
  );
};
