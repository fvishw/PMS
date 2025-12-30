import OutletWrapper from "@/components/mainLayout";
import { ReviewGoals } from "@/components/reviewGoals/reviewGoals";
import { SiteHeader } from "@/components/site-header";

function ReviewAppraisalLayout() {
  return (
    <>
      <SiteHeader headerName="Review Appraisal" />
      <OutletWrapper>
        <ReviewGoals />
      </OutletWrapper>
    </>
  );
}

export default ReviewAppraisalLayout;
