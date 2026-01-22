import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { AddPerformanceFormModal } from "./addPerformanceFormModal";
import { columns } from "./kpiTable.config";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";
import ApiErrorMessage from "../ApiErrorMessage";
import { useState } from "react";
import { Button } from "../ui/button";
import { AllPerformanceTemplate } from "@/types/performance";

const transformPerformanceData = (data: AllPerformanceTemplate[]) => {
  return data.map((item) => ({
    _id: item._id,
    designation: item.designation.title,
    role: item.designation.role,
    createdBy: item.createdBy.fullName,
    createdAt: item.createdAt,
  }));
};

function Performance() {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["performanceList"],
    queryFn: () => Api.fetchAllPerformanceRecords(),
  });

  let contentToRender;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  if (data)
    if (error) {
      return <ApiErrorMessage message={error.message} />;
    }
  if (data) {
    const transformedData = transformPerformanceData(data.performanceTemplates);
    contentToRender = (
      <CustomDataTable columns={columns} data={transformedData} />
    );
  }
  return (
    <>
      <div className="flex justify-end">
        <AddPerformanceFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
        <Button onClick={() => setIsOpen(true)}>Add Master Performance</Button>
      </div>
      {contentToRender}
    </>
  );
}

export default Performance;
