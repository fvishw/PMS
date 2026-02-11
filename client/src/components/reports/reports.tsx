import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import ApiErrorMessage from "../ApiErrorMessage";
import { columns } from "./reportsTable.config";
import ReportGenerateButton from "./reportGenerateButton";

function Report() {
  const { data, error, isLoading } = useQuery({
    queryFn: () => Api.fetchUserPastReports(),
    queryKey: ["reports"],
  });
  const users = data?.reports;
  if (isLoading) {
    return <div className="flex items-center justify-center w-full"></div>;
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
        <ReportGenerateButton />
      </div>
      <div className="w-full ">
        <CustomDataTable data={users || []} columns={columns} />
      </div>
    </>
  );
}

export default Report;
