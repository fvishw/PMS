import Kpis from "@/components/kpi";
import Competencies from "@/components/performace form/compentency";
import FinalReview from "@/components/performace form/finalReview";
import { KpiScoreTable } from "@/components/performace form/kpiTableScore";
import { SiteHeader } from "@/components/site-header";

function KpisLayout() {
  return (
    <>
      <SiteHeader headerName="Key Performance Indicators" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* <Kpis /> */}
            <KpiScoreTable />
            <Competencies />
            <FinalReview />
          </div>
        </div>
      </div>
    </>
  );
}

export default KpisLayout;
