import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function ProfileLayout() {
  return (
    <>
      <SiteHeader headerName="Profile" />
      <OutletWrapper>
        <div>
          {/* Profile content goes here */}
          This is the Profile page.
        </div>
      </OutletWrapper>
    </>
  );
}

export default ProfileLayout;
