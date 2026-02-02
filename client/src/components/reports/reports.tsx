import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import ApiErrorMessage from "../ApiErrorMessage";
import { GenerateReportModal } from "./generateReportModal";
import { columns } from "./reportsTable.config";

function Report() {
  const { data, error, isLoading } = useQuery({
    queryFn: () => Api.fetchUserReport(),
    queryKey: ["reports"],
  });
  const users = data?.reports;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  if (!data || !users) {
    return <ApiErrorMessage message="No user data available." />;
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <GenerateReportModal />
      </div>
      <div className="w-full ">
        <CustomDataTable data={users || []} columns={columns} />
      </div>
    </>
  );
}

export default Report;
