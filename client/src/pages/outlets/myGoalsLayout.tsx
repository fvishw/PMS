import OutletWrapper from "@/components/mainLayout";
import MyGoals from "@/components/myGoals/myGoals";
import { SiteHeader } from "@/components/site-header";

function MyGoalsLayout() {
  return (
    <>
      <SiteHeader headerName="Goal Management" />
      <OutletWrapper>
        <MyGoals />
      </OutletWrapper>
    </>
  );
}

export default MyGoalsLayout;
