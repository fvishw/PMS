import { AddUserModal } from "./addUserModal";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import { columns } from "./userTable.config";
import ApiErrorMessage from "../ApiErrorMessage";

export function UserTable() {
  const { data, error, isLoading } = useQuery({
    queryFn: () => Api.fetchAllUser(),
    queryKey: ["users"],
  });
  const users = data?.users;
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
        <AddUserModal />
      </div>
      <div className="w-full ">
        <CustomDataTable data={users || []} columns={columns} />
      </div>
    </>
  );
}
