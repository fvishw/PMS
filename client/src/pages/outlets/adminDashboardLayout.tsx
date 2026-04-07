import { CustomDataTable } from "@/components/customTable";
import OutletWrapper from "@/components/mainLayout";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { columns } from "@/components/performanceManagement/kpiTable.config";

export default function AdminDashboardLayout() {
  return (
    <>
      <SiteHeader headerName="Admin Dashboard" />
      <OutletWrapper>
        <SectionCards />
        <CustomDataTable data={[]} columns={columns} />
      </OutletWrapper>
    </>
  );
}
