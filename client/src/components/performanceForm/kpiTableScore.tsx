"use client";

import { columns } from "./kpiTableConfig";
import SectionWrapper from "./sectionWrapper";
import { CustomDataTable } from "../customTable";
import { KpiData } from "@/types/performance";

interface KpiTableProps {
  data: KpiData["kpis"];
}

export function KpiScoreTable({ data }: KpiTableProps) {
  return (
    <SectionWrapper title="Section A: KPI Scorecard">
      <CustomDataTable columns={columns} data={data} />
    </SectionWrapper>
  );
}
