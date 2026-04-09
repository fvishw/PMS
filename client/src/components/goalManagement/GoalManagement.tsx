import { useQuery } from "@tanstack/react-query";
import { CustomDataTable } from "../customTable";
import GoalFormDialog from "./GoalModal/GoalFormDialog";
import { columns, GoalRow } from "./goalTable.config";
import Api from "@/api/api";
import { useMemo, useState } from "react";
import { Spinner } from "../ui/spinner";
import ApiErrorMessage from "../ApiErrorMessage";
import { Button } from "../ui/button";
import { getTransformedGoals } from "./transformedGoals";
import GoalFilter from "./GoalFilter";
import GoalSummaryCards from "./GoalSummaryCards";
import type { PaginationState } from "@tanstack/react-table";

export type GoalFilterType = {
  userId: string | null;
  quarter: string | null;
  year: string | null;
};

export const GoalManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<GoalFilterType>({
    userId: null,
    quarter: null,
    year: null,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data,
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery({
    queryKey: ["goals", filter, pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      Api.getAdminGoals({
        ...filter,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  let contentToDisplay;

  const goals: GoalRow[] = useMemo(() => {
    return data?.goals ? getTransformedGoals(data.goals) : [];
  }, [data]);

  if (goalsLoading) {
    return (
      <div className="w-full rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (goalsError) {
    return <ApiErrorMessage message={goalsError?.message} />;
  }
  if (data) {
    contentToDisplay = (
      <div className="space-y-6">
        <GoalSummaryCards />
        <GoalFilter
          filter={filter}
          onChange={(newFilter) => {
            setFilter(newFilter);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
        />
        <CustomDataTable
          columns={columns}
          data={goals}
          pagination={{
            ...pagination,
            totalItems: data?.pagination.totalItems || 0,
            onPaginationChange: setPagination,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>Add Goal</Button>
        {isOpen && (
          <GoalFormDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </div>
      {contentToDisplay}
    </div>
  );
};
