import { ReviewAppraisalCard } from "./reviewAppraisalCard";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { CustomDataTable } from "../customTable";
import { columns } from "./reviewAppraisalTable.config";
import ApiErrorMessage from "../ApiErrorMessage";
import { useAuth } from "@/hooks/useAuthContext";
import { getReviewAppraisalApi } from "./reviewAppraisalApiMapper";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

export const ReviewAppraisal = () => {
  const { user } = useAuth();
  const role = user?.role || "";
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "reviewAppraisalData",
      role,
      user?._id,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: getReviewAppraisalApi(role, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  });
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }
  if (data) {
    const performances = data?.performances || [];
    return (
      <>
        <ReviewAppraisalCard />
        <CustomDataTable
          data={performances}
          columns={columns}
          pagination={{
            ...pagination,
            totalItems: data?.pagination.totalItems || 0,
            onPaginationChange: setPagination,
          }}
        />
      </>
    );
  }
  return null;
};
