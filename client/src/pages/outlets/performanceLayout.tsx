import Kpis from "@/components/kpi/kpi";
import OutletWrapper from "@/components/mainLayout";
import { PerformanceForm } from "@/components/performanceForm/performanceForm";
import { SiteHeader } from "@/components/site-header";

function KpisLayout() {
  return (
    <>
      <SiteHeader headerName="Key Performance Indicators" />
      <OutletWrapper>
        {/* <Kpis /> */}
        <PerformanceForm />
      </OutletWrapper>
    </>
  );
}

export default KpisLayout;
