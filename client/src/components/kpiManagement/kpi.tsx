import { columns, data } from "./kpiTable.config";

import { Dialog } from "../ui/dialog";
import { AddKpiFormModal } from "./addKpiFormModal";
import { CustomDataTable } from "../customTable";

function Kpi() {
  return (
    <Dialog>
      <div className=" pb-4">
        <AddKpiFormModal />
      </div>
      <CustomDataTable columns={columns} data={data} />
    </Dialog>
  );
}

export default Kpi;
