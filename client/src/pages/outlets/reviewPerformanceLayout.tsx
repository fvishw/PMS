import OutletWrapper from "@/components/mainLayout";
import { PerformanceForm } from "@/components/performanceForm/performanceForm";
import { SiteHeader } from "@/components/site-header";
import { useParams } from "react-router";

function ReviewPerformanceLayout() {
  const { performanceId } = useParams();
  return (
    <>
      <SiteHeader headerName="My Appraisal" />
      <OutletWrapper>
        <PerformanceForm performanceId={performanceId} />
      </OutletWrapper>
    </>
  );
}

export default ReviewPerformanceLayout;
