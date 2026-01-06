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
import ErrorMessage from "@/components/errorMessage";

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
  if (error) {
    dataToRender = <ErrorMessage message={error.message} />;
  }
  if (data) {
    if (Array.isArray(data.questionSet) && data.questionSet.length > 0) {
      const questionSet = data.questionSet;
      dataToRender = (
        <>
          <CheckInQuestionAns questions={questionSet} isPastCheckIn={true} />
        </>
      );
    } else {
      dataToRender = (
        <ErrorMessage message="No questions found for this version." />
      );
    }
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
