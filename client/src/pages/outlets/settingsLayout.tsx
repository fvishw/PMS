import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import Settings from "@/components/settings/settings";

function SettingsLayout() {
  return (
    <>
      <SiteHeader headerName="Settings" />
      <OutletWrapper>
        <Settings />
      </OutletWrapper>
    </>
  );
}

export default SettingsLayout;
