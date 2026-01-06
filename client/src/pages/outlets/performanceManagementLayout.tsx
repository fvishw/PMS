import Performance from "@/components/performanceManagement/performance";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function PerformanceManagementLayout() {
  return (
    <>
      <SiteHeader headerName="Performance Management" />
      <OutletWrapper>
        <Performance />
      </OutletWrapper>
    </>
  );
}

export default PerformanceManagementLayout;
