import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import ApiErrorMessage from "../ApiErrorMessage";
import { CustomDataTable } from "../customTable";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { QuarterSelect } from "../common/quarterSelect";
import { YearSelect } from "../common/yearOption";
import { adminReportsColumns } from "./adminReportsTable.config";
import { Spinner } from "../ui/spinner";
import type { PaginationState } from "@tanstack/react-table";

type AdminReportFilter = {
  search: string;
  quarter: string;
  year: string;
  role: string;
  overallScoreSort: "none" | "asc" | "desc";
};

const defaultFilter: AdminReportFilter = {
  search: "",
  quarter: "ALL",
  year: "ALL",
  role: "ALL",
  overallScoreSort: "none",
};

function AdminReports() {
  const [filters, setFilters] = useState<AdminReportFilter>(defaultFilter);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters.search, filters.quarter, filters.year, filters.role, filters.overallScoreSort]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminReports", filters, pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      Api.fetchAdminReports({
        search: filters.search.trim() || undefined,
        quarter: filters.quarter === "ALL" ? undefined : filters.quarter,
        year: filters.year === "ALL" ? undefined : filters.year,
        role: filters.role === "ALL" ? undefined : filters.role,
        overallScoreSort: filters.overallScoreSort,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  if (isLoading) {
    return (
      <div className="w-full rounded-md p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-64">
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Search by name or email"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <div className="w-full md:w-auto">
            <QuarterSelect
              value={filters.quarter}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, quarter: value }))
              }
              allowAllOption
              placeholder="Quarter"
            />
          </div>

          <div className="w-full md:w-auto">
            <YearSelect
              value={filters.year}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, year: value }))
              }
              allowAllOption
              placeholder="Year"
            />
          </div>

          <div className="w-full md:w-auto">
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-auto">
            <Select
              value={filters.overallScoreSort}
              onValueChange={(value: "none" | "asc" | "desc") =>
                setFilters((prev) => ({ ...prev, overallScoreSort: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Score: Default</SelectItem>
                <SelectItem value="asc">Score: Low to High</SelectItem>
                <SelectItem value="desc">Score: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <CustomDataTable
        data={data?.reports ?? []}
        columns={adminReportsColumns}
        pagination={{
          ...pagination,
          totalItems: data?.pagination.totalItems || 0,
          onPaginationChange: setPagination,
        }}
      />
    </div>
  );
}

export default AdminReports;
