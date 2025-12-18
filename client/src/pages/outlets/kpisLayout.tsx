import Kpis from "@/components/kpi";
import OutletWrapper from "@/components/mainLayout";
import Competencies from "@/components/performanceForm/competency";
import FinalReview from "@/components/performanceForm/finalReview";
import { KpiScoreTable } from "@/components/performanceForm/kpiTableScore";
import { SiteHeader } from "@/components/site-header";

function KpisLayout() {
  return (
    <>
      <SiteHeader headerName="Key Performance Indicators" />
      <OutletWrapper>
        {/* <Kpis /> */}
        <KpiScoreTable />
        <Competencies />
        <FinalReview />
      </OutletWrapper>
    </>
  );
}

export default KpisLayout;
