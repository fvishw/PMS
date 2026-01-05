import Api from "@/api/api";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import CheckInQuestionAns from "@/components/checkIns/checkInQuestionAns";
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
  const { isLoading, data, error } = useQuery({
    queryKey: ["questions", version],
    queryFn: () => Api.fetchCheckInQuestions(version),
    enabled: !!version,
  });
  let dataToRender;
  if (isLoading) {
    dataToRender = (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (data && Array.isArray(data.questionSet)) {
    const questionSet = data.questionSet;
    dataToRender = (
      <>
        <CheckInQuestionAns questions={questionSet} isPastCheckIn={true} />
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Question Set: {version}</DialogTitle>
        </DialogHeader>
        {dataToRender}
      </DialogContent>
    </Dialog>
  );
};
