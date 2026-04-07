import { useAuth } from "@/hooks/useAuthContext";

import AdminDashboardLayout from "./adminDashboardLayout";
import EmployeeDashboardLayout from "./employeeDashboardLayout";
import ManagerDashboardLayout from "./managerDashboardLayout";

export default function DashboardOutlet() {
  const { user } = useAuth();

  switch (user?.role) {
    case "admin":
      return <AdminDashboardLayout />;
    case "manager":
      return <ManagerDashboardLayout />;
    case "employee":
    default:
      return <EmployeeDashboardLayout />;
  }
}
