import { CustomDataTable } from "@/components/customTable";
import { Dialog } from "../../ui/dialog";
import { AddCheckInQuestionModal } from "../addQuestionModal/addCheckInQuestionModal";
import { columns } from "./questionSetTable.config";

function QuestionManagement() {
  return (
    <Dialog>
      <div className="w-full flex justify-end pb-4">
        <AddCheckInQuestionModal />
      </div>
      <CustomDataTable columns={columns} data={[]} />
    </Dialog>
  );
}

export default QuestionManagement;
