import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function CheckIn() {
  return (
    <>
      <SiteHeader headerName="CheckIn" />
      <OutletWrapper>
        <div>
          {/* CheckIn content goes here */}
          this one is for monthly checkins
        </div>
      </OutletWrapper>
    </>
  );
}

export default CheckIn;
