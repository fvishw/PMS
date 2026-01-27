import Home from "@/components/home/home";
import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";

function HomeOutlet() {
  return (
    <>
      <SiteHeader headerName="Home" />
      <OutletWrapper>
        <Home />
      </OutletWrapper>
    </>
  );
}

export default HomeOutlet;
