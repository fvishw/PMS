import { MeetingManagement } from "@/components/meetings/MeetingManagement";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function MeetingsLayout() {
  return (
    <>
      <SiteHeader headerName="One-on-One Meetings" />
      <OutletWrapper>
        <MeetingManagement />
      </OutletWrapper>
    </>
  );
}

export default MeetingsLayout;
