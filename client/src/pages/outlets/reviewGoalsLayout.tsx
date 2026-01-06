import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function ReviewGoalsLayout() {
  return (
    <>
      <SiteHeader headerName="Review Goals" />
      <OutletWrapper>
        <div>
          {/* Review Goals content goes here */}
          This is the Review Goals page.
        </div>
      </OutletWrapper>
    </>
  );
}

export default ReviewGoalsLayout;
