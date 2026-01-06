import OutletWrapper from "@/components/mainLayout";
import PerformanceDetails from "@/components/performanceManagement/performanceDetails";
import { SiteHeader } from "@/components/site-header";

export default function performanceDetailsTemplate() {
  return (
    <>
      <SiteHeader headerName="CheckIn" />
      <OutletWrapper>
        <PerformanceDetails />
      </OutletWrapper>
    </>
  );
}
