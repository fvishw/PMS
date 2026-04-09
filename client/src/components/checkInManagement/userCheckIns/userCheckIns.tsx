import Api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../checkInManagement/checkInTable.config";
import { Spinner } from "../../ui/spinner";
import { CustomDataTable } from "../../customTable";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

export const UserCheckIns = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["userCheckIns", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      Api.fetchAllUserCheckIns({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
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
      <CustomDataTable
        data={data?.checkIns || []}
        columns={columns}
        pagination={{
          ...pagination,
          totalItems: data?.pagination.totalItems || 0,
          onPaginationChange: setPagination,
        }}
      />
    </div>
  );
};
