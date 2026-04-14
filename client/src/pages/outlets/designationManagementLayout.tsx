import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import { DesignationTable } from "@/components/designationManagement/designationTable";

function designationManagementLayout() {
  return (
    <>
      <SiteHeader headerName="Designation Management" />
      <OutletWrapper>
        <DesignationTable />
      </OutletWrapper>
    </>
  );
}

export default designationManagementLayout;
