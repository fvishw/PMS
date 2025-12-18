import { DataTable } from "@/components/data-table";
import OutletWrapper from "@/components/mainLayout";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

function HomeOutlet() {
  return (
    <>
      <SiteHeader headerName="Home" />
      <OutletWrapper>
        <SectionCards />
        <DataTable data={[]} />
      </OutletWrapper>
    </>
  );
}

export default HomeOutlet;
