type Kpi = {
  objective: string;
  indicator: string;
  weight: number;
  selfScore?: number;
  selfComments?: string;
  managerScore?: number;
  managerComments?: string;
};

interface KpiData {
  kpis: Kpi[];
}

type Competency = {
  title: string;
  indicators: string[];
};

type CompetenciesData = Competency[];

export type { Kpi, KpiData, CompetenciesData, Competency };
