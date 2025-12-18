import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function MyAppraisalLayout() {
  return (
    <>
      <SiteHeader headerName="My Appraisal" />
      <OutletWrapper>
        <div>
          {/* My Appraisal content goes here */}
          This is the My Appraisal page.
        </div>
      </OutletWrapper>
    </>
  );
}

export default MyAppraisalLayout;
