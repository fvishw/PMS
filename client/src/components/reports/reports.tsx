import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import { CustomDataTable } from "../customTable";
import ApiErrorMessage from "../ApiErrorMessage";
import { columns } from "./reportsTable.config";
import ReportGenerateButton from "./reportGenerateButton";
import { useAuth } from "@/hooks/useAuthContext";
import AdminReports from "./adminReports";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

function Report() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  if (isAdmin) {
    return <AdminReports />;
  }

  const { data, error, isLoading } = useQuery({
    queryFn: () =>
      Api.fetchUserPastReports({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    queryKey: ["reports", pagination.pageIndex, pagination.pageSize],
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
        <CustomDataTable
          data={users || []}
          columns={columns}
          pagination={{
            ...pagination,
            totalItems: data?.pagination.totalItems || 0,
            onPaginationChange: setPagination,
          }}
        />
      </div>
    </>
  );
}

export default Report;
