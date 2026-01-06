import Kpis from "@/components/kpi/kpi";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function KpisLayout() {
  return (
    <>
      <SiteHeader headerName="Key Performance Indicators" />
      <OutletWrapper>
        <Kpis />
      </OutletWrapper>
    </>
  );
}

export default KpisLayout;
