import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { AddPerformanceFormModal } from "./addPerformanceFormModal";
import { columns } from "./kpiTable.config";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import ErrorMessage from "../errorMessage";
import { useState } from "react";
import { Button } from "../ui/button";

type PerformanceTableRow = {
  _id: string;
  designation: {
    title: string;
    role: string;
  };
  role: string;
  createdBy: {
    fullName: string;
  };
  createdAt: string;
};

function Performance() {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceList"],
    queryFn: () => Api.fetchAllPerformanceRecords(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  const tableData: PerformanceTableRow[] = (
    data?.performanceTemplates || []
  ).map((performance: PerformanceTableRow) => ({
    id: performance._id,
    designation: performance.designation?.title || "N/A",
    role: performance.designation?.role || "N/A",
    createdBy: performance.createdBy?.fullName || "N/A",
    createdAt: dayjs(performance.createdAt).format("D MMM YY"),
  }));

  return (
    <>
      <div className="flex justify-end">
        <AddPerformanceFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
        <Button onClick={() => setIsOpen(true)}>Add Master Performance</Button>
      </div>
      <CustomDataTable columns={columns} data={tableData} />
    </>
  );
}

export default Performance;
