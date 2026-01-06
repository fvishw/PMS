import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function MyGoalLayout() {
  return (
    <>
      <SiteHeader headerName="My Goal" />
      <OutletWrapper>
        <div>This is the My Goal page.</div>
      </OutletWrapper>
    </>
  );
}

export default MyGoalLayout;
