import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import { CheckInManagement } from "@/components/checkInManagement/checkInManagement/checkInManagement";

function checkInManagementLayout() {
  return (
    <>
      <SiteHeader headerName="CheckIn" />
      <OutletWrapper>
        <CheckInManagement />
      </OutletWrapper>
    </>
  );
}

export default checkInManagementLayout;
