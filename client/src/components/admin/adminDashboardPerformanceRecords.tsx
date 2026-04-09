import { useQuery } from "@tanstack/react-query";
import Api from "@/api/api";
import ApiErrorMessage from "../ApiErrorMessage";
import { Spinner } from "../ui/spinner";
import { CustomDataTable } from "../customTable";
import { adminReportsColumns } from "../reports/adminReportsTable.config";
import { useMemo, useState } from "react";
import { QuarterSelect } from "../common/quarterSelect";
import { YearSelect } from "../common/yearOption";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function AdminDashboardPerformanceRecords() {
  const [quarter, setQuarter] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [scoreSort, setScoreSort] = useState<"asc" | "desc">("desc");

  const dashboardColumns = useMemo(
    () =>
      adminReportsColumns.filter((column) => {
        if (!("accessorKey" in column)) {
          return true;
        }

        const accessor = column.accessorKey;

        return (
          accessor !== "email" &&
          accessor !== "quarter" &&
          accessor !== "year" &&
          accessor !== "actions"
        );
      }),
    [],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminDashboardPerformanceRecords", quarter, year, scoreSort],
    queryFn: () =>
      Api.fetchAdminReports({
        quarter: quarter === "ALL" ? undefined : quarter,
        year: year === "ALL" ? undefined : year,
        overallScoreSort: scoreSort,
        page: 1,
        limit: 10,
      }),
  });

  const reports = useMemo(() => data?.reports ?? [], [data?.reports]);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Recent Performance Records</h3>
        <p className="text-sm text-muted-foreground">
          Showing top {reports.length} reports
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:justify-end">
        <div className="w-full md:w-auto">
          <QuarterSelect
            value={quarter}
            onChange={setQuarter}
            allowAllOption
            placeholder="Quarter"
          />
        </div>

        <div className="w-full md:w-auto">
          <YearSelect
            value={year}
            onChange={setYear}
            allowAllOption
            placeholder="Year"
          />
        </div>

        <div className="w-full md:w-auto">
          <Select
            value={scoreSort}
            onValueChange={(value: "asc" | "desc") => setScoreSort(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Score: High to Low</SelectItem>
              <SelectItem value="asc">Score: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CustomDataTable
        data={reports}
        columns={dashboardColumns}
        showPagination={false}
      />
    </div>
  );
}
