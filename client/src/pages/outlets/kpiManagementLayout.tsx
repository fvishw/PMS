import KpiTable from "@/components/kpiManagement/kpiTable";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function kpiManagementLayout() {
  return (
    <>
      <SiteHeader headerName="KPI Management" />
      <OutletWrapper>
        <KpiTable />
      </OutletWrapper>
    </>
  );
}

export default kpiManagementLayout;
