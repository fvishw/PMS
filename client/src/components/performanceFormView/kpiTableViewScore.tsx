import { CustomDataTable } from "../customTable";
import { KpiData } from "@/types/performance";
import { ColumnDef } from "@tanstack/react-table";
import SectionWrapper from "../performanceForm/sectionWrapper";
import { getColumns, KPI } from "./kpiTableViewConfig";

interface KpiTableProps {
  data: KpiData["kpis"];
}

export function KpiScoreViewTable({ data }: KpiTableProps) {
  const columns: ColumnDef<KPI>[] = getColumns();
  return (
    <SectionWrapper title="Section A: KPI Scorecard">
      <CustomDataTable columns={columns} data={data} />
    </SectionWrapper>
  );
}
