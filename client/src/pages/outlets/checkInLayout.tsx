import CheckIns from "@/components/checkIns/checkIns";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function CheckInLayout() {
  return (
    <>
      <SiteHeader headerName="CheckIn" />
      <OutletWrapper>
        <CheckIns />
      </OutletWrapper>
    </>
  );
}

export default CheckInLayout;
