import { columns, data } from "./checkInTable.config";
import { Dialog } from "../ui/dialog";
import { AddCheckInQuestionModal } from "./addCheckInQuestionModal";
import { CustomDataTable } from "../customTable";

function CheckInManagement() {
  return (
    <Dialog>
      <div className=" pb-4">
        <AddCheckInQuestionModal />
      </div>
      <CustomDataTable columns={columns} data={data} />
    </Dialog>
  );
}

export default CheckInManagement;
