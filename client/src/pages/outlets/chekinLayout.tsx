import CheckIns from "@/components/checkins/checkins";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function CheckIn() {
  return (
    <>
      <SiteHeader headerName="CheckIn" />
      <OutletWrapper>
        <CheckIns />
      </OutletWrapper>
    </>
  );
}

export default CheckIn;
