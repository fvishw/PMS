import { CustomDataTable } from "@/components/customTable";
import OutletWrapper from "@/components/mainLayout";
import { columns } from "@/components/performanceManagement/kpiTable.config";
import { SiteHeader } from "@/components/site-header";
import UserDashboard from "@/components/userDashboard/userDashboard";

function HomeOutlet() {
  return (
    <>
      <SiteHeader headerName="Home" />
      <OutletWrapper>
        {/* <SectionCards /> */}
        <UserDashboard />
        <CustomDataTable data={[]} columns={columns} />
      </OutletWrapper>
    </>
  );
}

export default HomeOutlet;
