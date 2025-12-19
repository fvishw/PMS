import Kpi from "@/components/kpiManagement/kpi";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function kpiManagementLayout() {
  return (
    <>
      <SiteHeader headerName="KPI Management" />
      <OutletWrapper>
        <Kpi />
      </OutletWrapper>
    </>
  );
}

export default kpiManagementLayout;
