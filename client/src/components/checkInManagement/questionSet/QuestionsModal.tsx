import Api from "@/api/api";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import CheckInQuestionAns from "@/components/checkIns/checkInQuestionAns";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export const QuestionsModal = ({
  version,
  isOpen,
  onClose,
}: {
  version: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);
  const { isLoading, data, error } = useQuery({
    queryKey: ["questions", version],
    queryFn: () => Api.fetchCheckInQuestions(version),
    enabled: !!version,
  });
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden">
          <Spinner />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Question Set: {version}</DialogTitle>
        </DialogHeader>
        <CheckInQuestionAns
          questions={data?.question_set || null}
          isPastCheckIn={true}
        />
      </DialogContent>
    </Dialog>
  );
};
