import OutletWrapper from "@/components/mainLayout";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import AdminDashboardPerformanceRecords from "@/components/admin/adminDashboardPerformanceRecords";

export default function AdminDashboardLayout() {
  return (
    <>
      <SiteHeader headerName="Admin Dashboard" />
      <OutletWrapper>
        <SectionCards />
        <AdminDashboardPerformanceRecords />
      </OutletWrapper>
    </>
  );
}
