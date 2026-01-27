import { useAuth } from "@/hooks/useAuthContext";
import { CustomDataTable } from "../customTable";
import { columns } from "../performanceManagement/kpiTable.config";
import { SectionCards } from "../section-cards";
import UserDashboard from "../userDashboard/userDashboard";

export const Home = () => {
  const { user } = useAuth();
  const role = user?.role || "employee";

  return (
    <>
      {role === "admin" && <SectionCards />}
      <UserDashboard />
      {/* colums need to change */}
      <CustomDataTable data={[]} columns={columns} />
    </>
  );
};

export default Home;
