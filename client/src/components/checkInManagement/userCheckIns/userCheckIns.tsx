import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../checkInManagement/checkInTable.config";
import { Spinner } from "../../ui/spinner";
import { CustomDataTable } from "../../customTable";
import ApiErrorMessage from "@/components/ApiErrorMessage";

export const UserCheckIns = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userCheckIns"],
    queryFn: () => Api.fetchAllUserCheckIns(),
  });

  if (isLoading) {
    return (
      <div className="w-full ">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  return (
    <div className="w-full py-4">
      <CustomDataTable data={data?.checkIns || []} columns={columns} />
    </div>
  );
};
