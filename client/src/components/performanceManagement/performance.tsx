import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { Dialog } from "../ui/dialog";
import { AddPerformanceFormModal } from "./addPerformanceFormModal";
import { columns } from "./kpiTable.config";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import ErrorMessage from "../errorMessage";

function Performance() {
  const { isLoading, error, data } = useQuery({
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
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  const tableData = [];
  if (data && data?.performanceTemplates) {
    for (const performance of data.performanceTemplates) {
      const formattedDate = dayjs(performance.createdAt).format("D MMM YY");
      tableData.push({
        id: performance._id,
        designation: performance.designation?.title || "N/A",
        role: performance.designation?.role || "N/A",
        createdBy: performance.createdBy
          ? performance.createdBy.fullName
          : "N/A",
        createdAt: formattedDate,
      });
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <AddPerformanceFormModal />
      </div>
      <CustomDataTable columns={columns} data={tableData} />
    </>
  );
}

export default Performance;
