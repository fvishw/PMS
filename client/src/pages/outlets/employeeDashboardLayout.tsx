import { CustomDataTable } from "@/components/customTable";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import { columns } from "@/components/performanceManagement/kpiTable.config";
import UserDashboard from "@/components/userDashboard/userDashboard";

export default function EmployeeDashboardLayout() {
  return (
    <>
      <SiteHeader headerName="Employee Dashboard" />
      <OutletWrapper>
        <UserDashboard />
        <CustomDataTable data={[]} columns={columns} />
      </OutletWrapper>
    </>
  );
}
