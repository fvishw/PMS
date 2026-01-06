import DashboardPage from "@/pages/dashboard";
import ProtectedRoute from "./ProtectedRoute";

function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

export default ProtectedDashboard;
