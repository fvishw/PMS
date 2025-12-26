import { CustomDataTable } from "@/components/customTable";
import OutletWrapper from "@/components/mainLayout";
import { columns } from "@/components/performanceManagement/kpiTable.config";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

function HomeOutlet() {
  return (
    <>
      <SiteHeader headerName="Home" />
      <OutletWrapper>
        <SectionCards />
        <CustomDataTable data={[]} columns={columns} />
      </OutletWrapper>
    </>
  );
}

export default HomeOutlet;
