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
import { useEffect } from "react";

export const UserPastCheckInModal = ({
  checkInId,
  isOpen,
  onClose,
}: {
  checkInId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);
  const { isLoading, data, error } = useQuery({
    queryKey: ["employeePastCheckIns", checkInId],
    queryFn: () => Api.fetchCheckIn(checkInId),
    enabled: !!checkInId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden">
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
      </DialogContent>
    </Dialog>
  );
};
