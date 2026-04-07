import OutletWrapper from "@/components/mainLayout";
import Report from "@/components/reports/reports";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/useAuthContext";

const ReportsLayout = () => {
  const { user } = useAuth();
  const headerName = user?.role === "admin" ? "All Reports" : "My Reports";

  return (
    <>
      <SiteHeader headerName={headerName} />
      <OutletWrapper>
        <Report />
      </OutletWrapper>
    </>
  );
};

export default ReportsLayout;
