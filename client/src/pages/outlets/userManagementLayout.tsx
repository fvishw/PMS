import OutletWrapper from "@/components/mainLayout";
import { SiteHeader } from "@/components/site-header";
import { UserTable } from "@/components/userTable";

function userManagementLayout() {
  return (
    <>
      <SiteHeader headerName="User Management" />
      <OutletWrapper>
        <UserTable />
      </OutletWrapper>
    </>
  );
}
export default userManagementLayout;
