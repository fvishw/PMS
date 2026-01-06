import OutletWrapper from "@/components/mainLayout";
import { ReviewAppraisal } from "@/components/reviewAppraisal/reviewAppraisal";
import { SiteHeader } from "@/components/site-header";

function ReviewAppraisalLayout() {
  return (
    <>
      <SiteHeader headerName="Review Appraisal" />
      <OutletWrapper>
        <ReviewAppraisal />
      </OutletWrapper>
    </>
  );
}

export default ReviewAppraisalLayout;
