import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function ReviewAppraisalLayout() {
  return (
    <>
      <SiteHeader headerName="Review Appraisal" />
      <OutletWrapper>
        <div>
          {/* Review Appraisal content goes here */}
          This is the Review Appraisal page.
        </div>
      </OutletWrapper>
    </>
  );
}

export default ReviewAppraisalLayout;
