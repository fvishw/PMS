import { getColumns, KPI } from "./kpiTableConfig";
import SectionWrapper from "./sectionWrapper";
import { CustomDataTable } from "../customTable";
import { EditPermissions, KpiData } from "@/types/performance";
import { ColumnDef } from "@tanstack/react-table";

interface KpiTableProps {
  data: KPI[];
  permissions: EditPermissions;
  register?: any;
}

export function KpiScoreTable({ data, permissions, register }: KpiTableProps) {
  const columns: ColumnDef<KPI>[] = getColumns(permissions, register);
  return (
    <SectionWrapper title="Section A: KPI Scorecard">
      <CustomDataTable columns={columns} data={data} />
    </SectionWrapper>
  );
}
