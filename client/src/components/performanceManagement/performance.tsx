import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { Dialog } from "../ui/dialog";
import { AddPerformanceFormModal } from "./addPerformanceFormModal";
import { columns } from "./kpiTable.config";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";

function Performance() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["performanceList"],
    queryFn: () => Api.fetchAllPerformanceRecords(),
  });

  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  const tableData = [];
  console.log(data);
  if (data && data?.performances) {
    for (const performance of data.performances) {
      tableData.push({
        id: performance._id,
        designation: performance.designation?.title || "N/A",
        createdBy: performance.createdBy
          ? performance.createdBy.fullName
          : "N/A",
        createdAt: new Date(performance.createdAt).toLocaleDateString(),
      });
    }
  }

  return (
    <Dialog>
      <div className="flex justify-end">
        <AddPerformanceFormModal />
      </div>
      <CustomDataTable columns={columns} data={tableData} />
    </Dialog>
  );
}

export default Performance;
