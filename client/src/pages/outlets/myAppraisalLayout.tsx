import OutletWrapper from "@/components/mainLayout";
import { PerformanceForm } from "@/components/performanceForm/performanceForm";
import { SiteHeader } from "@/components/site-header";

function MyAppraisalLayout() {
  return (
    <>
      <SiteHeader headerName="My Appraisal" />
      <OutletWrapper>
        <div>
          <PerformanceForm />
        </div>
      </OutletWrapper>
    </>
  );
}

export default MyAppraisalLayout;
