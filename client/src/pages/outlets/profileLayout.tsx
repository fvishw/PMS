import OutletWrapper from "@/components/mainLayout";
import Profile from "@/components/profile/profile";
import { SiteHeader } from "@/components/site-header";

function ProfileLayout() {
  return (
    <>
      <SiteHeader headerName="Profile" />
      <OutletWrapper>
        <Profile />
      </OutletWrapper>
    </>
  );
}

export default ProfileLayout;
