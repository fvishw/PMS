import { GoalManagement } from "@/components/goalManagement/GoalManagement";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function ReviewGoalsLayout() {
  return (
    <>
      <SiteHeader headerName="Goal Management" />
      <OutletWrapper>
        <GoalManagement />
      </OutletWrapper>
    </>
  );
}

export default ReviewGoalsLayout;
