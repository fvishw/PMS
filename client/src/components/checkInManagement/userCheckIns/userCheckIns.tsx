import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../checkInManagement/checkInTable.config";
import { Spinner } from "../../ui/spinner";
import { CustomDataTable } from "../../customTable";

export const UserCheckIns = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
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
  return (
    <div className="w-full py-4">
      <CustomDataTable data={userData?.checkIns || []} columns={columns} />
    </div>
  );
};
