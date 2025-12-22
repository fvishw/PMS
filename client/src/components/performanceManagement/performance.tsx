import { columns, data } from "./kpiTable.config";

import { Dialog } from "../ui/dialog";
import { AddKpiFormModal } from "./addPerformanceFormModal";
import { CustomDataTable } from "../customTable";

function Performance() {
  return (
    <Dialog>
      <div className=" pb-4">
        <AddKpiFormModal />
      </div>
      <CustomDataTable columns={columns} data={data} />
    </Dialog>
  );
}

export default Performance;
