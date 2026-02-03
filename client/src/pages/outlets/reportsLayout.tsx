import OutletWrapper from "@/components/mainLayout";
import Report from "@/components/reports/reports";
import { SiteHeader } from "@/components/site-header";

const ReportsLayout = () => {
  return (
    <>
      <SiteHeader headerName="My Reports" />
      <OutletWrapper>
        <Report />
      </OutletWrapper>
    </>
  );
};

export default ReportsLayout;
