import { CustomDataTable } from "@/components/customTable";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import { columns } from "@/components/performanceManagement/kpiTable.config";
import UserDashboard from "@/components/userDashboard/userDashboard";

export default function ManagerDashboardLayout() {
  return (
    <>
      <SiteHeader headerName="Manager Dashboard" />
      <OutletWrapper>
        <UserDashboard />
        <CustomDataTable data={[]} columns={columns} />
      </OutletWrapper>
    </>
  );
}
