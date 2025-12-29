import { CustomDataTable } from "@/components/customTable";
import { Dialog } from "../../ui/dialog";
import { AddCheckInQuestionModal } from "../addQuestionModal/addCheckInQuestionModal";
import { columns } from "./questionSetTable.config";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { Spinner } from "@/components/ui/spinner";

function QuestionManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ["checkInQuestionsByVersion"],
    queryFn: async () => Api.getAllQuestionByVersion(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <>
      <Dialog>
        <div className="w-full flex justify-end pb-4">
          <AddCheckInQuestionModal />
        </div>
      </Dialog>
      <CustomDataTable columns={columns} data={data?.question_set || []} />
    </>
  );
}

export default QuestionManagement;
